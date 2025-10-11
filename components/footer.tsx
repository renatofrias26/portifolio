import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-icon.svg"
              alt="Upfolio"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} Upfolio. Upload. Share. Get hired.
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Built with Next.js, TypeScript & AI ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
