import React from "react";

import fs from "fs";
import path from "path";

export async function StitchScreen({
  filename,
  stripShell,
}: {
  filename: string;
  stripShell?: boolean;
}) {
  // Load raw HTML from localized disk template
  const filepath = path.join(process.cwd(), "src", "data", "stitch", filename);

  let htmlContent = "";
  try {
    htmlContent = fs.readFileSync(filepath, "utf-8");
  } catch (error) {
    return (
      <div className="p-8 text-red-500">
        Failed to load local HTML template: {filename}
      </div>
    );
  }

  // Extract the head block and body block
  const headMatch = htmlContent.match(/<head>([\s\S]*?)<\/head>/i);
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyTagMatch = htmlContent.match(/<body([^>]*)>/i);

  const bodyClassMatch = bodyTagMatch
    ? bodyTagMatch[1].match(/class="([^"]+)"/)
    : null;
  const bodyClass = bodyClassMatch ? bodyClassMatch[1] : "";

  const headHtml = headMatch ? headMatch[1] : "";
  let bodyHtml = bodyMatch ? bodyMatch[1] : "";

  if (stripShell) {
    bodyHtml = bodyHtml.replace(/<aside[\s\S]*?<\/aside>/i, "");
    bodyHtml = bodyHtml.replace(/<header[\s\S]*?<\/header>/i, "");

    // Remove ALL hardcoded margin-left/padding constraints since the Layout wrapper handles it
    bodyHtml = bodyHtml.replace(/\bml-64\b/g, "");
    bodyHtml = bodyHtml.replace(/\bpl-64\b/g, "");
    bodyHtml = bodyHtml.replace(/\bmt-16\b/g, "");
    bodyHtml = bodyHtml.replace(/\bpt-24\b/g, "pt-8");
    bodyHtml = bodyHtml.replace(/\bpt-16\b/g, "");

    // Apply max-width constraint to dashboard specifically
    if (filename === "dashboard.html" || filename === "logs.html") {
      bodyHtml = bodyHtml.replace(
        /<main([^>]*)class="([^"]*)"/i,
        '<main$1class="$2 max-w-[1200px] mx-auto w-full"',
      );
    }
  }

  // Rewrite sidebar href links to point to the actual Next.js routes
  bodyHtml = bodyHtml.replace(
    /<a([^>]*?)href="[#]?"([^>]*)>([\s\S]*?)<\/a>/gi,
    (match, prefix, suffix, innerHtml) => {
      const textContext = innerHtml.toLowerCase();
      let newHref = "#";

      if (textContext.includes("dashboard")) newHref = "/dashboard";
      else if (textContext.includes("agent")) newHref = "/agents";
      else if (textContext.includes("workflow")) newHref = "/workflow";
      else if (textContext.includes("log")) newHref = "/logs";
      else return match;

      return `<a${prefix}href="${newHref}"${suffix}>${innerHtml}</a>`;
    },
  );

  // Extract scripts
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let headHtmlNoScripts = headHtml;
  const scripts = [];

  let match;
  while ((match = scriptRegex.exec(headHtml)) !== null) {
    scripts.push(match[0]);
    headHtmlNoScripts = headHtmlNoScripts.replace(match[0], "");
  }

  // Find Tailwind config script
  const twConfig = scripts.find((s) => s.includes("tailwind.config"));

  // Profile dropdown + Mobile Hamburger & Sidebar Expand/Collapse script
  const mobileScript = `
    document.addEventListener('DOMContentLoaded', () => {
      const aside = document.querySelector('aside');
      
      // If there is an aside (sidebar)
      if (aside) {
        // Add smooth transition to the aside
        aside.style.transition = 'transform 0.3s ease-in-out';
        
        // 1. Create a Hamburgers button
        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>';
        menuBtn.style.cssText = 'position: fixed; top: 1.25rem; left: 1.25rem; z-index: 50; padding: 0.5rem; background-color: #0b1326; color: #fff; border-radius: 0.5rem; border: 1px solid #1e293b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); cursor: pointer;';
        
        // Hide button on desktop
        menuBtn.classList.add('lg:hidden'); 
        
        // Insert into DOM
        document.body.appendChild(menuBtn);

        // Simple media query check
        const isMobile = () => window.innerWidth < 1024;
        
        // Hide sidebar initially on mobile
        if (isMobile()) {
          aside.style.transform = 'translateX(-100%)';
        }

        // Resize handler to reset transform on desktop
        window.addEventListener('resize', () => {
          if (!isMobile()) {
            aside.style.transform = 'translateX(0)';
            menuBtn.style.display = 'none';
          } else {
            aside.style.transform = 'translateX(-100%)';
            menuBtn.style.display = 'block';
          }
        });

        // Toggle aside on mobile
        menuBtn.addEventListener('click', () => {
          if (aside.style.transform === 'translateX(-100%)') {
           aside.style.transform = 'translateX(0)';
          } else {
           aside.style.transform = 'translateX(-100%)';
          }
        });
        
        // Close sidebar if a link is clicked
        const asideLinks = aside.querySelectorAll('a');
        asideLinks.forEach(link => {
          link.addEventListener('click', () => {
             if (isMobile()) {
               aside.style.transform = 'translateX(-100%)';
             }
          });
        });
      }

      // Profile dropdown logout
      const profileBtn = document.querySelector('header .flex.items-center.gap-3.bg-surface-container-high');
      if (profileBtn) {
        // Build dropdown
        const dropdown = document.createElement('div');
        dropdown.style.cssText = 'position:absolute;top:calc(100% + 8px);right:0;min-width:160px;background:#171f33;border:1px solid rgba(70,69,84,0.4);border-radius:12px;padding:6px;box-shadow:0 8px 24px rgba(0,0,0,0.4);z-index:100;display:none;';
        dropdown.innerHTML = \`
          <div style="padding:10px 12px 8px;border-bottom:1px solid rgba(70,69,84,0.3);margin-bottom:4px;">
            <p style="font-size:11px;font-weight:700;color:#dae2fd;">Signed in as</p>
            <p style="font-size:10px;color:#908fa0;margin-top:2px;">admin@voiceai.com</p>
          </div>
          <button id="logout-btn" style="width:100%;display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;background:transparent;border:none;color:#ffb4ab;font-size:13px;font-weight:600;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='rgba(147,0,10,0.2)'" onmouseout="this.style.background='transparent'">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Log out
          </button>
        \`;

        // Make profile wrapper relative
        profileBtn.style.position = 'relative';
        profileBtn.appendChild(dropdown);

        // Toggle dropdown
        profileBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Close on outside click
        document.addEventListener('click', () => {
          dropdown.style.display = 'none';
        });

        // Logout action
        dropdown.addEventListener('click', (e) => e.stopPropagation());
        document.getElementById('logout-btn')?.addEventListener('click', () => {
          window.location.href = '/';
        });
      }
    });
  `;

  return (
    <>
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script dangerouslySetInnerHTML={{ __html: mobileScript }} />

      {twConfig && <div dangerouslySetInnerHTML={{ __html: twConfig }} />}

      <div dangerouslySetInnerHTML={{ __html: headHtmlNoScripts }} />

      <div
        className={bodyClass}
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </>
  );
}
