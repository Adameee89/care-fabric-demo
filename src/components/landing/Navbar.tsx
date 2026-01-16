import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'For Doctors', href: '/for-doctors' },
    { label: 'For Patients', href: '/for-patients' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'AI Assistant', href: '/ai' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg-hero flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              Medi<span className="gradient-text">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  Demo Login
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/login?role=patient')}>
                  Login as Patient
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/login?role=doctor')}>
                  Login as Doctor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/login?role=admin')}>
                  Login as Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="hero" onClick={() => navigate('/login')}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border animate-slide-in-up">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                Demo Login
              </Button>
              <Button variant="hero" className="w-full" onClick={() => navigate('/login')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
