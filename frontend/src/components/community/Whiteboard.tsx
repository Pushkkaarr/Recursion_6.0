'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Socket } from 'socket.io-client';
import { Undo, Redo, Circle, Square, Type, Pencil, Image as ImageIcon, Trash, Download, Save, Loader2, BookOpen } from 'lucide-react';

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
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);

  // Initialize canvas with proper dimensions
  useEffect(() => {
    if (canvasRef.current && containerRef.current && !canvas) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: containerWidth,
        height: containerHeight,
        backgroundColor: 'white'
      });
      
      setCanvas(fabricCanvas);
      
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = brushSize;
      
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
      
      if (socket) {
        socket.on(`whiteboard:${channelId}:update`, (data: string) => {
          const emitEvents = fabricCanvas.__eventListeners['object:modified'] || [];
          fabricCanvas.__eventListeners['object:modified'] = [];
          
          try {
            fabricCanvas.loadFromJSON(data, () => {
              fabricCanvas.renderAll();
              fabricCanvas.__eventListeners['object:modified'] = emitEvents;
            });
          } catch (err) {
            console.error('Error loading whiteboard data:', err);
            fabricCanvas.__eventListeners['object:modified'] = emitEvents;
          }
        });
        
        socket.emit('whiteboard:join', channelId);
        socket.emit('whiteboard:requestState', channelId);
      }
      
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
  
  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [canvas, color, brushSize]);
  
  useEffect(() => {
    if (!canvas) return;
    
    if (tool === 'pencil') {
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [canvas, tool]);
  
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
  
  const downloadCanvas = () => {
    if (!canvas) return;
    
    try {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
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

  // New function to solve whiteboard content using Gemini API
  const solveWhiteboard = async () => {
    if (!canvas) return;

    setIsSolving(true);
    setSolution(null);

    try {
      // Capture whiteboard as image
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      });

      // Convert to base64
      const base64Image = dataURL.split(',')[1];

      // Send to Gemini API
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY || "", // Ensure you set this in your .env
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: "image/png",
                      data: base64Image,
                    },
                  },
                  {
                    text: "Analyze the image and solve any mathematical or logical problems shown. Provide a concise answer.",
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        throw new Error("Invalid response from Gemini API.");
      }

      const generatedSolution = data.candidates[0].content.parts[0].text;
      setSolution(generatedSolution);
    } catch (error) {
      console.error('Error solving whiteboard:', error);
      setSolution("Failed to generate solution. Please try again.");
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            className={`p-2 rounded-md transition-all duration-200 ${
              tool === 'pencil' 
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setTool('pencil')}
            title="Pencil Tool"
          >
            <Pencil size={20} strokeWidth={1.5} />
          </button>
          <button 
            className={`p-2 rounded-md transition-all duration-200 ${
              tool === 'rect' 
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => {
              setTool('rect');
              addShape('rect');
            }}
            title="Rectangle Tool"
          >
            <Square size={20} strokeWidth={1.5} />
          </button>
          <button 
            className={`p-2 rounded-md transition-all duration-200 ${
              tool === 'circle' 
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => {
              setTool('circle');
              addShape('circle');
            }}
            title="Circle Tool"
          >
            <Circle size={20} strokeWidth={1.5} />
          </button>
          <button 
            className={`p-2 rounded-md transition-all duration-200 ${
              tool === 'text' 
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => {
              setTool('text');
              addText();
            }}
            title="Text Tool"
          >
            <Type size={20} strokeWidth={1.5} />
          </button>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <div className="group relative">
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
              style={{ backgroundColor: color }}
              title="Select Color"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800" style={{ backgroundColor: color }}></div>
          </div>
          <div className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-2 w-8 text-center">{brushSize}px</span>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-28 h-2 appearance-none bg-gray-200 dark:bg-gray-700 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:cursor-pointer"
              title="Brush Size"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-md hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 transition-colors duration-200" 
            onClick={clearCanvas}
            title="Clear Canvas"
          >
            <Trash size={20} strokeWidth={1.5} />
          </button>
          <button 
            className="p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300 transition-colors duration-200" 
            onClick={downloadCanvas}
            title="Download"
          >
            <Download size={20} strokeWidth={1.5} />
          </button>
          <button 
            className="flex items-center px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow-sm transition-colors duration-200"
            onClick={saveCanvas}
            title="Save"
          >
            <Save size={18} strokeWidth={1.5} className="mr-2" />
            <span>Save</span>
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-800"
        style={{ height: 'calc(100vh - 60px)' }}
      >
        <canvas ref={canvasRef} />
        
        {/* Solve Button in Bottom Right */}
        <button
          className="absolute bottom-6 right-6 p-3.5 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 dark:focus:ring-green-500"
          onClick={solveWhiteboard}
          disabled={isSolving}
          title="Solve"
        >
          {isSolving ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <BookOpen size={24} />
          )}
        </button>

        {/* Solution Overlay */}
        {solution && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 animate-fadeIn">
              <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Solution</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm border border-gray-100 dark:border-gray-700 max-h-[70vh] overflow-y-auto">
                {solution}
              </div>
              <button
                className="w-full p-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
                onClick={() => setSolution(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}