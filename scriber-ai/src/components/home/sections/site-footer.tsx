import { LogoIcon } from "@/components/home/ui";
import Link from "next/link";


export function SiteFooter() {
  return (
    <footer className="bg-surface-container-low border-t border-surface-variant py-12 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-4 md:px-10 max-w-[1200px] mx-auto gap-8">
        <div className="max-w-xs">
          <div className="font-title-lg text-title-lg font-bold text-primary mb-4 flex items-center gap-2">
            <LogoIcon className="h-6 w-6" />
            <span>Scriber Builder</span>
          </div>
          <p className="font-label-lg text-label-lg text-on-surface-variant">
            Empowering professionals to reach their career goals through superior design and intelligent tools.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          <div className="flex flex-col gap-3">
            <p className="font-title-md text-title-md text-on-surface">Product</p>
            <Link href="/templates" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all underline-offset-4 hover:underline">
              Templates
            </Link>
            <Link href="/pricing" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all underline-offset-4 hover:underline">
              Pricing
            </Link>
            <Link href="/testimonials" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all underline-offset-4 hover:underline">
              Success Stories
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-title-md text-title-md text-on-surface">Company</p>
            <a href="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all underline-offset-4 hover:underline">
              About Us
            </a>
            <a href="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all underline-offset-4 hover:underline">
              Career Blog
            </a>
            <a href="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all underline-offset-4 hover:underline">
              Contact Us
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-title-md text-title-md text-on-surface">Support</p>
            <a href="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all underline-offset-4 hover:underline">
              Help Center
            </a>
            <a href="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all underline-offset-4 hover:underline">
              Terms of Service
            </a>
            <a href="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all underline-offset-4 hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-10 mt-12 pt-8 border-t border-surface-variant/30 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-label-lg text-label-lg text-on-surface-variant opacity-70">
          © {new Date().getFullYear()} Scriber Builder Professional. All rights reserved.
        </p>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
            public
          </span>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
            hub
          </span>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
            chat
          </span>
        </div>
      </div>
    </footer>
  );
}