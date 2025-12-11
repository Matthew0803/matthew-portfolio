import { Github, Linkedin, Mail } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { SiDevpost } from "react-icons/si";

export default function SocialBar() {
  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/Matthew0803",
      color: "hover:text-purple-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/matthew-wong83/",
      color: "hover:text-blue-400",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:m262wong@uwaterloo.ca",
      color: "hover:text-green-400",
    },
    {
      name: "X",
      icon: FaXTwitter,
      href: "https://x.com/12Matthew354999",
      color: "hover:text-blue-500",
    },
    {
      name: "Devpost",
      icon: SiDevpost,
      href: "https://devpost.com/matthewfc83?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav",
      color: "hover:text-indigo-500",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-t border-border overflow-hidden">
      <div className="animate-marquee whitespace-nowrap py-4 inline-flex w-max-content">
        <div className="inline-flex gap-8 px-8">
          {/* Repeat items for seamless loop */}
          {[...socialLinks, ...socialLinks, ...socialLinks, ...socialLinks].map((link, index) => (
            <a
              key={`${link.name}-${index}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-muted-foreground transition-colors ${link.color}`}
            >
              <link.icon className="h-5 w-5" />
              <span className="font-medium">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
