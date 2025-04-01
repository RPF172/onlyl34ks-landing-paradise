
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-onlyl34ks-bg-darker text-onlyl34ks-text-muted pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <div className="text-2xl font-bold mb-2 text-onlyl34ks-text-light">ONLYL<span className="text-onlyl34ks-accent">34</span>KS</div>
            <p className="max-w-xs">Buy once. Own forever. Access exclusive digital content from your favorite creators.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-onlyl34ks-text-light mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-onlyl34ks-accent transition-colors">Browse Content</a></li>
                <li><a href="#" className="hover:text-onlyl34ks-accent transition-colors">Featured Creators</a></li>
                <li><a href="#" className="hover:text-onlyl34ks-accent transition-colors">How It Works</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-onlyl34ks-text-light mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-onlyl34ks-accent transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-onlyl34ks-accent transition-colors">Creator Portal</a></li>
                <li><a href="#" className="hover:text-onlyl34ks-accent transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-onlyl34ks-text-light mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-onlyl34ks-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-onlyl34ks-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-onlyl34ks-accent transition-colors">Content Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-onlyl34ks-bg-light/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} ONLYL34KS. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" aria-label="Twitter" className="hover:text-onlyl34ks-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" aria-label="Discord" className="hover:text-onlyl34ks-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.2c1.2-1 2.6-1.7 4.2-2a1 1 0 0 1 1.1.7c.2.6.4 1.4.5 2.1"/><path d="M7.5 16.8c1.2 1 2.6 1.7 4.2 2a1 1 0 0 0 1.1-.7c.2-.6.4-1.4.5-2.1"/><path d="m14 7.2-.9 1.1"/><path d="m10 17-.9-1.1"/><path d="M4.3 9.2c-.2.6-.3 1.2-.3 1.8 0 2.6 1.7 4.8 4 5.6"/><path d="M20 15.5c-.2-.4-.5-.8-.8-1.2"/><path d="M18.9 17.8c-2.3 1.3-5 2-7.9 2-2.6 0-5.1-.6-7.3-1.6"/><path d="M20 8.5a10 10 0 0 0-.8-1.2"/><path d="M18.9 6.2a15 15 0 0 0-15.2.5"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-onlyl34ks-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
