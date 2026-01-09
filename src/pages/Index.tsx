import { Link } from 'react-router-dom';
import { useBlogStore } from '@/store/blogStore';
import { BlogCard } from '@/components/blog/BlogCard';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import profileImage from '@/assets/profile-manoj.png';

export default function Index() {
  const { blogs } = useBlogStore();
  const recentBlogs = blogs.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container py-6 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl font-semibold text-foreground">
          Manoj
        </Link>
        <nav>
          <Link 
            to="/blog" 
            className="font-sans text-accent hover:text-foreground transition-colors"
          >
            Blog
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1fr,auto] gap-12 items-start">
          <div className="order-2 lg:order-1">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl italic text-foreground mb-8 animate-fade-in">
              Tech Entrepreneur / Innovator / Visionary
            </h1>
            
            <div className="space-y-6 text-foreground/90 font-sans leading-relaxed animate-slide-up">
              <p>
                I'm a tech entrepreneur driven by the belief that technology has the power to unlock untapped potential from the most unexpected places. As the Co-Founder of CogniMuse, I've dedicated myself to building impactful products and systems that help startups thrive by avoiding common pitfalls that often lead to failure in tech ventures.
              </p>
              
              <p>
                My journey began in Manipal, a place that shaped my perspective and approach to innovation. CogniMuse was born out of a vision to create an ecosystem where passionate, driven individuals from tier-2 and tier-3 cities could evolve into global leaders. We hire based on passion and drive, not pedigree, and leverage AI-powered systems to deliver rapid, high-impact tech and design solutions for startups across the US and Europe.
              </p>
              
              <p>
                Before founding CogniMuse, I co-founded several ventures, including Marble AI, a deep-tech company designed to transform how data is processed and turned into actionable insights. Marble helped professionals dive deeper into their data, revealing patterns and insights that the human brain might miss. It was here that I honed my skills in product engineering, tech leadership, and AI-powered solutions that now fuel CogniMuse's success.
              </p>
              
              <p>
                In addition to my entrepreneurial ventures, I worked on Stealth Startup, where we built AI solutions focused on rehabilitation. This initiative empowered underserved communities to recover and return to work faster, reinforcing my belief in the intersection between technology and social impact.
              </p>
              
              <p>
                I have always taken an unconventional path—from biomedical engineering to deep-diving into healthcare and AI—solving complex challenges with simple, actionable solutions. Along the way, I've been fortunate to work with visionary leaders like Rev. Swami Vinayakanandaji Maharaj, Sridhar Vembu, and the Tata family, whose influence continues to shape my business philosophy.
              </p>
              
              <p>
                Today, my work is driven by the desire to create systems and solutions that have the potential to change lives. From product development to talent incubation, my focus remains on purpose, impact, and the relentless pursuit of innovation.
              </p>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in">
            <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden bg-muted shadow-lg">
              <img 
                src={profileImage} 
                alt="Manoj - Tech Entrepreneur" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-muted/30 py-16">
        <div className="container max-w-4xl">
          <blockquote className="text-center">
            <p className="font-serif text-xl sm:text-2xl lg:text-3xl italic text-foreground/90 leading-relaxed mb-6">
              "Innovation is not just about creating new products but about solving problems that have the power to change lives."
            </p>
            <footer className="font-sans text-accent">
              — Manoj
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground">Recent posts</h2>
          <Link 
            to="/blog"
            className="font-sans text-accent hover:text-foreground transition-colors flex items-center gap-2"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="bg-foreground text-background py-16">
        <div className="container">
          <h2 className="font-serif text-2xl font-semibold mb-8">Contact Manoj</h2>
          
          <div className="space-y-4 font-sans">
            <a 
              href="mailto:manoj@cognimuse.com" 
              className="flex items-center gap-3 text-background/80 hover:text-background transition-colors"
            >
              <Mail className="h-5 w-5" />
              manoj@cognimuse.com
            </a>
            <a 
              href="tel:+918861078009" 
              className="flex items-center gap-3 text-background/80 hover:text-background transition-colors"
            >
              <Phone className="h-5 w-5" />
              88610 78009
            </a>
          </div>
          
          <div className="mt-12 pt-8 border-t border-background/20 text-center text-sm text-background/60">
            Built with ❤️ using Lovable
          </div>
        </div>
      </footer>
    </div>
  );
}
