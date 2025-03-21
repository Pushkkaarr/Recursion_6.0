
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Upload, 
  FileText, 
  Download,
  Video,
  File,
  Image,
  Users,
  Clock,
  Calendar,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Sample content data
const contents = [
  {
    id: 1,
    title: "Introduction to Algebra",
    type: "document",
    format: "PDF",
    subject: "Mathematics",
    uploadedDate: "2023-10-15",
    size: "2.5 MB",
    views: 45,
    tags: ["Algebra", "Introduction", "Mathematics"],
  },
  {
    id: 2,
    title: "Solving Quadratic Equations",
    type: "document",
    format: "DOCX",
    subject: "Mathematics",
    uploadedDate: "2023-10-10",
    size: "1.8 MB",
    views: 32,
    tags: ["Algebra", "Quadratic", "Mathematics"],
  },
  {
    id: 3,
    title: "Laws of Motion Explained",
    type: "video",
    format: "MP4",
    subject: "Physics",
    uploadedDate: "2023-09-28",
    size: "45.2 MB",
    views: 87,
    tags: ["Physics", "Motion", "Newton's Laws"],
  },
  {
    id: 4,
    title: "Cell Structure and Function",
    type: "presentation",
    format: "PPTX",
    subject: "Biology",
    uploadedDate: "2023-09-20",
    size: "5.7 MB",
    views: 63,
    tags: ["Biology", "Cells", "Microscopy"],
  },
  {
    id: 5,
    title: "Chemical Bonding Diagram",
    type: "image",
    format: "JPG",
    subject: "Chemistry",
    uploadedDate: "2023-09-15",
    size: "0.8 MB",
    views: 41,
    tags: ["Chemistry", "Bonding", "Visual Aid"],
  },
  {
    id: 6,
    title: "World War II Timeline",
    type: "document",
    format: "PDF",
    subject: "History",
    uploadedDate: "2023-10-05",
    size: "3.2 MB",
    views: 29,
    tags: ["History", "World War II", "Timeline"],
  },
];

// Content type options for filtering
const contentTypes = [
  { value: "all", label: "All Types" },
  { value: "document", label: "Documents" },
  { value: "video", label: "Videos" },
  { value: "presentation", label: "Presentations" },
  { value: "image", label: "Images" },
];

// Subjects for filtering
const subjects = [
  { value: "all", label: "All Subjects" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "History", label: "History" },
];

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Filter content based on search query and filters
  const filteredContent = contents.filter((content) => {
    const matchesSearch = 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === "all" || content.type === selectedType;
    const matchesSubject = selectedSubject === "all" || content.subject === selectedSubject;
    
    return matchesSearch && matchesType && matchesSubject;
  });

  // Content type statistics
  const documentCount = contents.filter(c => c.type === "document").length;
  const videoCount = contents.filter(c => c.type === "video").length;
  const presentationCount = contents.filter(c => c.type === "presentation").length;
  const imageCount = contents.filter(c => c.type === "image").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">
            Upload, organize, and share educational content with your students
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Content
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload New Content</DialogTitle>
                <DialogDescription>
                  Add educational materials for your students.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input id="title" placeholder="Enter content title" />
                </div>
                <div className="grid items-center gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter a brief description" 
                    rows={3} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid items-center gap-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      Content Type
                    </label>
                    <Select defaultValue="document">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid items-center gap-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Select defaultValue="Mathematics">
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid items-center gap-2">
                  <label htmlFor="tags" className="text-sm font-medium">
                    Tags (comma separated)
                  </label>
                  <Input id="tags" placeholder="e.g. algebra, equations, beginner" />
                </div>
                <div className="grid items-center gap-2">
                  <label htmlFor="file" className="text-sm font-medium">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Drag & drop your file here</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Or click to browse (max 50MB)
                    </p>
                    <Input
                      id="file"
                      type="file"
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" className="mt-4">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowUploadDialog(false)}>
                  Upload Content
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Documents</p>
                <p className="text-3xl font-bold">{documentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <Video className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Videos</p>
                <p className="text-3xl font-bold">{videoCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <File className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Presentations</p>
                <p className="text-3xl font-bold">{presentationCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/10 p-3 rounded-full">
                <Image className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Images</p>
                <p className="text-3xl font-bold">{imageCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
          <CardDescription>
            Browse, search, and manage your educational content
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or tags..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>
                    <div className="font-medium">{content.title}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {content.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {content.type === "document" && <FileText className="h-4 w-4 text-blue-500" />}
                      {content.type === "video" && <Video className="h-4 w-4 text-green-500" />}
                      {content.type === "presentation" && <File className="h-4 w-4 text-amber-500" />}
                      {content.type === "image" && <Image className="h-4 w-4 text-purple-500" />}
                      <span>{content.format}</span>
                    </div>
                  </TableCell>
                  <TableCell>{content.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(content.uploadedDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{content.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span>{content.views}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View Content
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" /> Share with Students
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
