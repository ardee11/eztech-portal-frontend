import React from "react";

const archives = [
  { id: "2025", label: "INVENTORY 2025", url: "https://docs.google.com/spreadsheets/d/1R8SKRrR8WxPeFAb9B0GGHGS_4-axag4xC9l1ipCk7gc/edit?gid=755501823#gid=755501823" },
  { id: "2021-2024", label: "INVENTORY 2021 - 2024", url: "https://docs.google.com/spreadsheets/d/12O4TLl79wpgpeCASIlsuWq7GraE6KM8h/edit?gid=39531551#gid=39531551" },
];

export default function InventoryArchives() {

  return (
    <div className="w-full p-4 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-4 py-3">
          <div className="space-x-3"></div>
          <h2 className="text-lg font-bold">Inventory Archives</h2>
          <p className="text-sm text-gray-600">Select an archive to view its contents.</p>
        </div>

        <div className="p-3">
          <ul className="space-y-1 border-b border-gray-50">
            {archives.map((a) => (
              <li key={a.id}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${a.label} in new tab`}
                  className="w-full flex items-center justify-between p-3 bg-white border-b"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-sm text-gray-900">{a.label}</span>
                  </div>

                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
