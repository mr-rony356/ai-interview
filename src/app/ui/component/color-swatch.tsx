export default function ColorSwatch() {
  return (
    <div className="mt-3">
      <div className="flex max-w-md items-center gap-4 rounded-full border bg-white p-2 shadow-sm">
        <div className="h-12 w-12 rounded-full bg-[#064CDB]"></div>
        <div>
          <h5 className="text-sm font-medium text-gray-900">Active Blue</h5>
          <span className="text-xs text-gray-500">#064CDB</span>
        </div>
      </div>
    </div>
  );
}
