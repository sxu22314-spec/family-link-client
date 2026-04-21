import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Calendar,
  Tag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  fetchFamilyPhotos,
  uploadFamilyPhoto,
  deleteFamilyPhoto,
  FamilyPhoto,
} from "../../services/api";

const PHOTO_THEMES = [
  { label: "Daily Life", value: "daily-life" },
  { label: "holiday", value: "holiday" },
  { label: "family-gathering", value: "family-gathering" },
  { label: "travel", value: "travel" },
  { label: "sports", value: "sports" },
  { label: "food", value: "food" },
];

const PHOTOS_PER_PAGE = 4;

interface UploadFormData {
  title: string;
  shotDate: string;
  subject: string;
  file: File | null;
}

export function FamilyMoments() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for photos display
  const [photos, setPhotos] = useState<FamilyPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPhotos, setTotalPhotos] = useState(0);

  // State for filters
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // State for upload dialog
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    title: "",
    shotDate: "",
    subject: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // State for delete dialog
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch photos on mount and when filters/page changes
  useEffect(() => {
    loadPhotos();
  }, [currentPage, selectedSubject, selectedDate]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const filters: any = {
        page: currentPage,
        pageSize: PHOTOS_PER_PAGE,
      };

      if (selectedSubject && selectedSubject !== "all") {
        filters.subject = selectedSubject;
      }

      if (selectedDate) {
        // For date filtering, we use the selected date for both start and end to get photos from that day
        filters.dateFrom = selectedDate;
        filters.dateTo = selectedDate;
      }

      const result = await fetchFamilyPhotos(filters);
      setPhotos(result.photos || []);
      setTotalPhotos(result.total || 0);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to load photos");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm((prev) => ({ ...prev, file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async () => {
    // Validation
    if (!uploadForm.title.trim()) {
      setUploadError("请输入照片标题 (Title is required)");
      return;
    }

    if (!uploadForm.subject) {
      setUploadError("请选择照片主题 (Theme is required)");
      return;
    }

    if (!uploadForm.file) {
      setUploadError("请选择照片 (Please select a photo)");
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      await uploadFamilyPhoto(
        uploadForm.file,
        uploadForm.title,
        uploadForm.subject,
        uploadForm.shotDate || undefined
      );

      // Reset form and reload photos
      setUploadForm({
        title: "",
        shotDate: "",
        subject: "",
        file: null,
      });
      setPreviewUrl(null);
      setUploadDialogOpen(false);
      setCurrentPage(1); // Go back to first page
      await loadPhotos();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    setDeletePhotoId(photoId);
  };

  const confirmDelete = async () => {
    if (!deletePhotoId) return;

    try {
      setDeleting(true);
      await deleteFamilyPhoto(deletePhotoId);
      setDeletePhotoId(null);
      await loadPhotos();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete photo");
    } finally {
      setDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedSubject("");
    setSelectedDate("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalPhotos / PHOTOS_PER_PAGE);

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/grandparents-center")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Grandparents Center</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl mb-1 text-amber-700">Family Moments</h1>
          <p className="text-base text-gray-700 mb-1">Precious Family Memories</p>
          <p className="text-sm text-gray-600 px-4">
            Share and browse precious family photos collected over time
          </p>
        </div>

        {/* Upload Button */}
        <div className="mb-6">
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Start Sharing Photos
          </button>
        </div>

        {/* Subject Filter Only */}
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-4 mb-6">
          <div className="grid grid-cols-1">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="border-2 border-orange-200">
                <Tag className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Themes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                {PHOTO_THEMES.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedSubject && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-orange-600 hover:text-orange-700 underline mt-2"
            >
              clear fillter
            </button>
          )}
        </div>

        {/* Photos Grid Section */}
        {loading ? (
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-8 text-center text-amber-700">
            Loading photos...
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-2xl border-2 border-red-200 p-6 text-center">
            <p className="text-red-600 mb-2">Failed to load photos</p>
            <p className="text-sm text-gray-600 mb-4">{loadError}</p>
            <button
              onClick={() => loadPhotos()}
              className="px-4 py-2 rounded-lg bg-orange-100 border border-orange-200 text-orange-800 hover:bg-orange-200"
            >
              Retry
            </button>
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-orange-200 p-8 text-center">
            <p className="text-gray-600 mb-4">
              {selectedSubject || selectedDate
                ? "No photos found matching your filters"
                : "No family photos yet"}
            </p>
            {selectedSubject || selectedDate ? (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-lg bg-orange-100 border border-orange-200 text-orange-800 hover:bg-orange-200"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setUploadDialogOpen(true)}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              >
                Upload First Photo
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative bg-white rounded-xl overflow-hidden border-2 border-orange-200 shadow-md flex flex-col"
                >
                  <img
                    src={photo.photoUrl}
                    alt={photo.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="flex items-center justify-between p-2">
                    <div>
                      <p className="text-xs text-gray-600 truncate font-medium">
                        {photo.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {PHOTO_THEMES.find((t) => t.value === photo.subject)?.label || photo.subject}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label="删除照片"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border-2 border-orange-200 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-orange-600" />
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (isNaN(val) || val < 1) val = 1;
                      if (val > totalPages) val = totalPages;
                      setCurrentPage(val);
                    }}
                    className="w-16 text-center border-2 border-orange-200 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:border-orange-400"
                  />

                  <span className="text-gray-700">/ {totalPages}</span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border-2 border-orange-200 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-orange-600" />
                  </button>
                </div>
                <div className="text-xs text-gray-500">共 {totalPhotos} 张照片</div>
              </div>
            )}
          </>
        )}

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-800">
                Upload Family Photo
              </DialogTitle>
              <DialogClose />
            </DialogHeader>

            <div className="space-y-4">
              {/* Photo Preview */}
              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-orange-200">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setUploadForm((prev) => ({ ...prev, file: null }));
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-orange-300 rounded-xl p-6 text-center cursor-pointer hover:bg-orange-50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 font-medium">
                    Tap to select a photo
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG, GIF (Max 10MB)</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Title Input - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Enter photo title"
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="border-2 border-orange-200 focus:border-orange-400"
                  disabled={uploading}
                />
              </div>

              {/* Shot Date Input - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo Shot Date <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={uploadForm.shotDate}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, shotDate: e.target.value }))
                  }
                  className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none"
                  disabled={uploading}
                />
              </div>

              {/* Subject Select - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo Theme <span className="text-red-500">*</span>
                </label>
                <Select
                  value={uploadForm.subject}
                  onValueChange={(value) =>
                    setUploadForm((prev) => ({ ...prev, subject: value }))
                  }
                >
                  <SelectTrigger className="border-2 border-orange-200">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {PHOTO_THEMES.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {uploadError}
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUploadSubmit}
                disabled={uploading || !previewUrl}
                className="w-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 text-white py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload Photo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletePhotoId !== null} onOpenChange={(open) => !open && setDeletePhotoId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg text-gray-800">
              DELETE!
            </DialogTitle>
            <DialogClose />
          </DialogHeader>

          <div className="py-3">
            <p className="text-gray-700 text-center">
               Are you sure you want to delete this photo?
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              This action cannot be undone
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDeletePhotoId(null)}
              disabled={deleting}
              className="flex-1 border-2 border-orange-200 text-gray-700 hover:bg-orange-50"
            >
              cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
