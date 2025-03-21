'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Socket } from 'socket.io-client';
import { Undo, Redo, Circle, Square, Type, Pencil, Image as ImageIcon, Trash, Download, Save } from 'lucide-react';

interface WhiteboardProps {
  channelId: string;
  socket: Socket | null;
}

export default function Whiteboard({ channelId, socket }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pencil' | 'rect' | 'circle' | 'text'>('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Initialize canvas with proper dimensions
  useEffect(() => {
    if (canvasRef.current && containerRef.current && !canvas) {
      // Get the dimensions of the container
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Create a canvas with the full size of the container
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: containerWidth,
        height: containerHeight,
        backgroundColor: 'white'
      });
      
      setCanvas(fabricCanvas);
      
      // Set initial brush
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = brushSize;
      
      // Handle resize to ensure canvas fills the container
      const handleResize = () => {
        if (containerRef.current) {
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          fabricCanvas.setWidth(width);
          fabricCanvas.setHeight(height);
          fabricCanvas.renderAll();
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // Collaborative features - listen to socket events
      if (socket) {
        // Listen for updates from other users
        socket.on(`whiteboard:${channelId}:update`, (data: string) => {
          // Temporarily disable event emission to prevent infinite loops
          const emitEvents = fabricCanvas.__eventListeners['object:modified'] || [];
          fabricCanvas.__eventListeners['object:modified'] = [];
          
          try {
            fabricCanvas.loadFromJSON(data, () => {
              fabricCanvas.renderAll();
              // Restore event listeners
              fabricCanvas.__eventListeners['object:modified'] = emitEvents;
            });
          } catch (err) {
            console.error('Error loading whiteboard data:', err);
            fabricCanvas.__eventListeners['object:modified'] = emitEvents;
          }
        });
        
        // Let other users know someone joined
        socket.emit('whiteboard:join', channelId);
        
        // Request latest canvas state
        socket.emit('whiteboard:requestState', channelId);
      }
      
      // Setup object modification and path creation events
      const emitCanvasChange = () => {
        if (socket) {
          socket.emit('whiteboard:update', {
            channelId,
            data: JSON.stringify(fabricCanvas)
          });
        }
      };
      
      fabricCanvas.on('object:added', emitCanvasChange);
      fabricCanvas.on('object:modified', emitCanvasChange);
      fabricCanvas.on('object:removed', emitCanvasChange);
      fabricCanvas.on('path:created', emitCanvasChange);
      
      // Clean up
      return () => {
        window.removeEventListener('resize', handleResize);
        fabricCanvas.dispose();
        if (socket) {
          socket.off(`whiteboard:${channelId}:update`);
          socket.off('whiteboard:requestState');
        }
      };
    }
  }, [canvasRef, containerRef, socket, channelId]);
  
  // Update brush when color or size changes
  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [canvas, color, brushSize]);
  
  // Handle tool change
  useEffect(() => {
    if (!canvas) return;
    
    if (tool === 'pencil') {
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [canvas, tool]);
  
  // Add shape
  const addShape = (shape: 'rect' | 'circle') => {
    if (!canvas) return;
    
    let obj;
    
    if (shape === 'rect') {
      obj = new fabric.Rect({
        left: canvas.width! / 2 - 50,
        top: canvas.height! / 2 - 50,
        width: 100,
        height: 100,
        fill: color
      });
    } else if (shape === 'circle') {
      obj = new fabric.Circle({
        left: canvas.width! / 2 - 50,
        top: canvas.height! / 2 - 50,
        radius: 50,
        fill: color
      });
    }
    
    if (obj) {
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
    }
  };
  
  // Add text
  const addText = () => {
    if (!canvas) return;
    
    const text = new fabric.IText('Edit this text', {
      left: canvas.width! / 2 - 50,
      top: canvas.height! / 2 - 10,
      fontFamily: 'Arial',
      fill: color,
      fontSize: 20
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };
  
  // Clear canvas
  const clearCanvas = () => {
    if (!canvas) return;
    
    try {
      canvas.clear();
      canvas.backgroundColor = 'white';
      canvas.renderAll();
      
      if (socket) {
        socket.emit('whiteboard:update', {
          channelId,
          data: JSON.stringify(canvas)
        });
      }
    } catch (err) {
      console.error('Error clearing canvas:', err);
    }
  };
  
  // Download canvas as image
  const downloadCanvas = () => {
    if (!canvas) return;
    
    try {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2, // Increased quality for better resolution
      });
      
      const link = document.createElement('a');
      link.download = `whiteboard-${channelId}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading canvas:', err);
    }
  };
  
  // Save canvas state
  const saveCanvas = () => {
    if (!canvas || !socket) return;
    
    try {
      socket.emit('whiteboard:save', {
        channelId,
        data: JSON.stringify(canvas)
      });
    } catch (err) {
      console.error('Error saving canvas:', err);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-white border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            className={`p-2 rounded ${tool === 'pencil' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setTool('pencil')}
          >
            <Pencil size={20} />
          </button>
          <button 
            className={`p-2 rounded ${tool === 'rect' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => {
              setTool('rect');
              addShape('rect');
            }}
          >
            <Square size={20} />
          </button>
          <button 
            className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => {
              setTool('circle');
              addShape('circle');
            }}
          >
            <Circle size={20} />
          </button>
          <button 
            className={`p-2 rounded ${tool === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => {
              setTool('text');
              addText();
            }}
          >
            <Type size={20} />
          </button>
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          <input 
            type="color" 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <div className="flex items-center">
            <span className="text-xs mr-1">{brushSize}px</span>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded hover:bg-gray-100" onClick={clearCanvas}>
            <Trash size={20} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100" onClick={downloadCanvas}>
            <Download size={20} />
          </button>
          <button 
            className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white flex items-center"
            onClick={saveCanvas}
          >
            <Save size={20} className="mr-1" />
            <span>Save</span>
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="flex-1 relative overflow-hidden bg-gray-50"
        style={{ height: 'calc(100vh - 60px)' }} // Set an explicit height
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}