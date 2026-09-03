import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  FileText,
  Compass,
  Crosshair,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useReports } from '../context/ReportsContext';
import { IssueCategory, PriorityLevel } from '../types';

interface ReportIssuePageProps {
  onNavigate: (route: string, complaintId?: string) => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({ onNavigate }) => {
  const { addReport, capturedHeroPhoto } = useReports();

  // If user came from hero photo capture, prefill image
  const [imagePreview, setImagePreview] = useState<string | null>(
    capturedHeroPhoto ||
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'
  );
  const [title, setTitle] = useState(capturedHeroPhoto ? 'Damaged Asphalt Pothole on Main Road' : '');
  const [category, setCategory] = useState<IssueCategory>('Road Damage');
  const [description, setDescription] = useState(
    capturedHeroPhoto
      ? 'Large road pothole creating hazardous conditions for morning traffic and two-wheelers.'
      : ''
  );
  const [location, setLocation] = useState('Cross Cut Road, Gandhipuram, Coimbatore');
  const [area, setArea] = useState('Gandhipuram');
  const [city, setCity] = useState('Coimbatore');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: IssueCategory[] = [
    'Road Damage',
    'Garbage',
    'Streetlight',
    'Drainage',
    'Water Supply',
    'Public Safety',
    'Other',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setLocation('Cross Cut Road Junction, Gandhipuram, Coimbatore (GPS Locked)');
          setArea('Gandhipuram');
        },
        (error) => {
          setIsLocating(false);
          setLocation('Near Town Hall Bus Stand, Coimbatore (GPS Default)');
        }
      );
    } else {
      setTimeout(() => {
        setIsLocating(false);
        setLocation('DB Road, RS Puram, Coimbatore (Approx. Location)');
      }, 600);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newId = addReport({
        title: title.trim() || `${category} Issue at ${area || 'Coimbatore'}`,
        category,
        description: description.trim(),
        location: location.trim(),
        area: area.trim() || 'Coimbatore Central',
        city: city.trim() || 'Coimbatore',
        priority,
        department: 'Highways & Municipal Road Maintenance Wing',
        imageUrl:
          imagePreview ||
          'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      });

      setIsSubmitting(false);
      setSubmittedComplaintId(newId);
    }, 700);
  };

  // SUCCESS SUBMISSION VIEW (Section 16 in specs)
  if (submittedComplaintId) {
    return (
      <div className="max-w-2xl mx-auto py-8 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Report Submitted Successfully ✓
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Your civic report has been dispatched to the municipal control desk. You can track the progress of your complaint in real time.
            </p>
          </div>

          {/* Generated Complaint ID Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Complaint Tracking ID
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-700 tracking-wider">
              {submittedComplaintId}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Category: {category} • Priority: {priority}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
            <button
              id="report-success-track-btn"
              onClick={() => onNavigate('/track', submittedComplaintId)}
              className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Track Complaint</span>
            </button>

            <button
              id="report-success-dashboard-btn"
              onClick={() => onNavigate('/dashboard')}
              className="flex-1 py-3.5 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Civic Issue
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload clear photographic evidence and pinpoint the problem location for municipal dispatch.
        </p>
      </div>

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        {/* 1. ISSUE PHOTO UPLOAD & PREVIEW */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Issue Photo <span className="text-emerald-600">*</span>
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video group">
              <img
                src={imagePreview}
                alt="Civic Issue Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg hover:bg-slate-100 transition-colors"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="p-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-xs rounded-lg text-xs font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Photo Attached</span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <Camera className="w-7 h-7 stroke-[2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Click to upload or capture a photo
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Supports JPG, PNG, WEBP from smartphone camera or file gallery
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2. ISSUE CATEGORY DROPDOWN */}
        <div>
          <label htmlFor="issue-category-select" className="block text-sm font-bold text-slate-800 mb-2">
            Issue Category <span className="text-emerald-600">*</span>
          </label>
          <select
            id="issue-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as IssueCategory)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 3. ISSUE TITLE (OPTIONAL / AUTO-GENERATED) */}
        <div>
          <label htmlFor="issue-title-input" className="block text-sm font-bold text-slate-800 mb-2">
            Issue Short Title
          </label>
          <input
            id="issue-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Deep Pothole Near Bus Stand"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* 4. DESCRIPTION TEXTAREA */}
        <div>
          <label htmlFor="issue-description-input" className="block text-sm font-bold text-slate-800 mb-2">
            Description <span className="text-emerald-600">*</span>
          </label>
          <textarea
            id="issue-description-input"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the civic issue..."
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none placeholder:text-slate-400"
          />
        </div>

        {/* 5. LOCATION WITH 'USE CURRENT LOCATION' OR MANUAL ENTRY */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="issue-location-input" className="block text-sm font-bold text-slate-800">
              Location <span className="text-emerald-600">*</span>
            </label>
            <button
              type="button"
              id="use-current-location-btn"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {isLocating ? (
                <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>Use Current Location</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              id="issue-location-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Cross Cut Road, Gandhipuram, Coimbatore"
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Interactive Map Pin Visual Preview */}
          <div className="rounded-xl bg-slate-100 border border-slate-200 p-3 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-slate-800">Geotag: 11.0168° N, 76.9558° E</span>
              <span className="text-slate-400">• Ward 24 Central</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Mapped to Zone 2</span>
          </div>
        </div>

        {/* 6. PRIORITY SELECTOR */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Priority / Severity
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Low', 'Medium', 'High', 'Urgent'] as PriorityLevel[]).map((level) => {
              const isSelected = priority === level;
              return (
                <button
                  type="button"
                  key={level}
                  onClick={() => setPriority(level)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? level === 'Urgent'
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : level === 'High'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-slate-100">
          <button
            id="report-issue-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-75 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
