export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} Renato Frias. All rights reserved.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Built with Next.js, TypeScript & AI ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
