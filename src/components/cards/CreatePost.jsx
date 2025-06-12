import React, { useState, useRef, useCallback, useEffect } from "react";
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Link, Image, Code, 
  Edit, Calendar, User, Eye, FileText, X,
  Type, Palette, Save, Download, Upload,
  Quote, Minus, RotateCcw, RotateCw
} from "lucide-react";

export default function WYSIWYGEditor() {
  const [title, setTitle] = useState("My Blog Post");
  const [activeTab, setActiveTab] = useState("Visual");
  const [tags, setTags] = useState(["Technology", "AI"]);
  const [newTag, setNewTag] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState("0min");
  const [htmlContent, setHtmlContent] = useState("");
  const [fontSize, setFontSize] = useState("14");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState("text");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Initialize editor with sample content
  useEffect(() => {
    if (editorRef.current && !htmlContent) {
      const initialContent = `
        <h2>Welcome to the WYSIWYG Editor</h2>
        <p>This is a <strong>rich text editor</strong> built with React. You can format text, add links, images, and much more!</p>
        <p>Key features:</p>
        <ul>
          <li>Rich text formatting (bold, italic, underline)</li>
          <li>Text alignment and lists</li>
          <li>Link and image insertion</li>
          <li>Color customization</li>
          <li>Import/Export functionality</li>
        </ul>
        <p>Start typing to see the <em>live preview</em> on the right side!</p>
      `;
      editorRef.current.innerHTML = initialContent;
      setHtmlContent(initialContent);
      updateWordCount(initialContent);
    }
  }, []);

  const updateWordCount = (content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.max(1, Math.ceil(words / 200)) + "min");
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };

  // Rich text editor functions
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, []);

  const handleFormatting = (command, value = null) => {
    execCommand(command, value);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHtmlContent(content);
      updateWordCount(content);
    }
  };

  const insertLink = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    setLinkText(selectedText || "");
    setLinkUrl("");
    setShowLinkModal(true);
  };

  const handleLinkSubmit = () => {
    if (linkUrl) {
      if (linkText) {
        // If we have text, create a link with that text
        const linkElement = `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
        execCommand("insertHTML", linkElement);
      } else {
        // If no text, just insert the URL
        execCommand("createLink", linkUrl);
      }
    }
    setShowLinkModal(false);
    setLinkText("");
    setLinkUrl("");
  };

  const insertImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        const imageElement = `<img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
        execCommand("insertHTML", imageElement);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    event.target.value = '';
  };

  const insertHorizontalRule = () => {
    execCommand("insertHorizontalRule");
  };

  const insertQuote = () => {
    execCommand("formatBlock", "blockquote");
  };

  const applyFontSize = () => {
    execCommand("fontSize", fontSize);
  };

  const applyColor = (type, color) => {
    if (type === "text") {
      execCommand("foreColor", color);
    } else {
      execCommand("hiliteColor", color);
    }
    setShowColorPicker(false);
  };

  const toggleColorPicker = (type) => {
    setColorPickerType(type);
    setShowColorPicker(!showColorPicker);
  };

  const undoAction = () => {
    execCommand("undo");
  };

  const redoAction = () => {
    execCommand("redo");
  };

  const saveContent = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadContent = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        if (editorRef.current) {
          editorRef.current.innerHTML = content;
          setHtmlContent(content);
          updateWordCount(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const switchToHTMLView = () => {
    if (activeTab === "Visual") {
      setActiveTab("HTML");
    } else {
      setActiveTab("Visual");
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlContent;
        updateWordCount(htmlContent);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side - Editor */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Edit size={20} />
                WYSIWYG Editor
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                  title="Import HTML"
                >
                  <Upload size={18} />
                </button>
                <button 
                  onClick={saveContent}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                  title="Export HTML"
                >
                  <Download size={18} />
                </button>
                <button className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all">
                  Publish
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={loadContent}
              accept=".html,.txt"
              className="hidden"
            />
            
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Title Input */}
            <div className="p-4 border-b border-gray-200">
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full text-2xl font-bold text-gray-900 border-none outline-none bg-transparent placeholder-gray-400" 
                placeholder="Enter your post title..." 
              />
            </div>

            {/* Tab Controls */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab("Visual")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === "Visual" 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Visual
                </button>
                <button 
                  onClick={switchToHTMLView}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === "HTML" 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  HTML
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-3 py-1 bg-white rounded-lg border">Words: {wordCount}</span>
                <span className="px-3 py-1 bg-white rounded-lg border">Read: {readingTime}</span>
              </div>
            </div>

            {activeTab === "Visual" && (
              <>
                {/* Enhanced Toolbar */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  {/* First Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {/* Undo/Redo */}
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={undoAction} 
                      title="Undo"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={redoAction} 
                      title="Redo"
                    >
                      <RotateCw size={16} />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    {/* Formatting */}
                    <select 
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white" 
                      onChange={(e) => handleFormatting("formatBlock", e.target.value)}
                    >
                      <option value="div">Normal</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="h4">Heading 4</option>
                      <option value="h5">Heading 5</option>
                      <option value="h6">Heading 6</option>
                    </select>

                    <select 
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      onBlur={applyFontSize}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
                    >
                      <option value="1">8pt</option>
                      <option value="2">10pt</option>
                      <option value="3">12pt</option>
                      <option value="4">14pt</option>
                      <option value="5">18pt</option>
                      <option value="6">24pt</option>
                      <option value="7">36pt</option>
                    </select>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    {/* Text Formatting */}
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={() => handleFormatting("bold")} 
                      title="Bold"
                    >
                      <Bold size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={() => handleFormatting("italic")} 
                      title="Italic"
                    >
                      <Italic size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={() => handleFormatting("underline")} 
                      title="Underline"
                    >
                      <Underline size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={() => handleFormatting("strikeThrough")} 
                      title="Strikethrough"
                    >
                      <Strikethrough size={16} />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    {/* Color Controls */}
                    <div className="relative">
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                        onClick={() => toggleColorPicker("text")} 
                        title="Text Color"
                      >
                        <Type size={16} />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                        onClick={() => toggleColorPicker("background")} 
                        title="Background Color"
                      >
                        <Palette size={16} />
                      </button>
                      
                      {showColorPicker && (
                        <div className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-10">
                          <div className="grid grid-cols-6 gap-2 mb-3">
                            {['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
                              '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
                              '#800000', '#008000', '#000080', '#808000', '#800080', '#008080'].map(color => (
                              <button
                                key={color}
                                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                onClick={() => applyColor(colorPickerType, color)}
                              />
                            ))}
                          </div>
                          <button 
                            onClick={() => setShowColorPicker(false)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Alignment */}
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={() => handleFormatting("justifyLeft")} 
                      title="Align Left"
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={() => handleFormatting("justifyCenter")} 
                      title="Align Center"
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={() => handleFormatting("justifyRight")} 
                      title="Align Right"
                    >
                      <AlignRight size={16} />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    {/* Lists */}
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={() => handleFormatting("insertUnorderedList")} 
                      title="Bullet List"
                    >
                      <List size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={() => handleFormatting("insertOrderedList")} 
                      title="Numbered List"
                    >
                      <ListOrdered size={16} />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    {/* Insert Elements */}
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={insertLink} 
                      title="Insert Link"
                    >
                      <Link size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={insertImage} 
                      title="Insert Image"
                    >
                      <Image size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={insertQuote} 
                      title="Quote"
                    >
                      <Quote size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={insertHorizontalRule} 
                      title="Horizontal Line"
                    >
                      <Minus size={16} />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all" 
                      onClick={() => handleFormatting("formatBlock", "pre")} 
                      title="Code Block"
                    >
                      <Code size={16} />
                    </button>
                  </div>
                </div>

                {/* Rich Text Editor */}
                <div className="p-4">
                  <div 
                    ref={editorRef}
                    contentEditable={true}
                    className="w-full min-h-96 p-4 text-gray-700 leading-relaxed outline-none bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ minHeight: '400px' }}
                    onInput={handleInput}
                    suppressContentEditableWarning={true}
                  />
                </div>
              </>
            )}

            {activeTab === "HTML" && (
              <div className="p-4">
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full min-h-96 p-4 text-sm font-mono text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ minHeight: '400px' }}
                  placeholder="HTML code will appear here..."
                />
              </div>
            )}

            {/* Tags Section */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)} 
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  onClick={handleAddTag} 
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Link Modal */}
          {showLinkModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insert Link</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Text (optional)
                    </label>
                    <input
                      type="text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Enter link text..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowLinkModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLinkSubmit}
                    disabled={!linkUrl}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Insert Link
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Live Preview */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-4">
            {/* Preview Header */}
            <div className="p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Eye size={18} />
                Live Preview
              </h3>
            </div>

            {/* Featured Image Placeholder */}
            <div className="h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-white text-center">
                  <FileText size={32} className="mx-auto mb-2 opacity-80" />
                  <div className="text-sm opacity-90">Featured Image</div>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-4">
              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <User size={10} />
                  <span>Author</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={10} />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={10} />
                  <span>{readingTime}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-lg font-bold text-gray-900 mb-4 leading-tight">
                {title || "Untitled Post"}
              </h1>

              {/* Content Preview */}
              <div 
                className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* Tags Preview */}
              {tags.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}