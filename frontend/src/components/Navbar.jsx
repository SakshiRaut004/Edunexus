export default function Navbar() {
  return (
    <div className="w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      
      <h1 className="text-xl font-bold tracking-wide">
        EduNexus
      </h1>

      <div className="space-x-4">
        <button className="hover:text-gray-300">Home</button>
        <button className="hover:text-gray-300">About</button>
      </div>

    </div>
  );
}