import { Link } from 'react-router-dom';
import { useBlogStore } from '@/store/blogStore';
import { BlogCard } from '@/components/blog/BlogCard';
import manojProfile from '@/assets/manoj-profile.png';

export default function Index() {
  const { blogs } = useBlogStore();
  const recentBlogs = blogs.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container py-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-semibold text-foreground">
          Manoj
        </Link>
        <nav>
          <Link 
            to="/blog" 
            className="text-foreground hover:text-muted-foreground transition-colors font-sans"
          >
            Blog
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl font-serif italic text-foreground mb-8">
              Tech Entrepreneur / Innovator / Visionary
            </h1>
            
            <div className="space-y-6 text-foreground/90 font-sans leading-relaxed">
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
          
          <div className="lg:col-span-1 flex justify-center lg:justify-end">
            <div className="w-64 h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden bg-muted">
              <img 
                src={manojProfile} 
                alt="Manoj - Tech Entrepreneur" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="container py-12">
        <div className="bg-muted/30 py-8 px-8 lg:px-12">
          <blockquote className="text-xl lg:text-2xl font-serif italic text-foreground/90 mb-4">
            "Innovation is not just about creating new products but about solving problems that have the power to change lives."
          </blockquote>
          <p className="text-foreground font-sans">— Manoj</p>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="container py-12">
        <h2 className="text-2xl font-serif font-semibold text-foreground mb-8">
          Recent Blog Posts
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentBlogs.map((blog) => (
            <Link key={blog.id} to={`/blog/${blog.id}`} className="group">
              <article className="space-y-4">
                {blog.coverImage && (
                  <div className="aspect-[16/10] overflow-hidden rounded-lg">
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-serif font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
                    {blog.emoji && <span className="mr-2">{blog.emoji}</span>}
                    {blog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-sans">
                    {blog.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex gap-2">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag} 
                          className="text-xs text-muted-foreground font-sans"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-sans">
                      {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container py-12 border-t border-border">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-serif font-semibold text-foreground">
            Contact Manoj
          </h3>
          <div className="space-y-2 text-muted-foreground font-sans">
            <p>
              Email: <a href="mailto:manoj@cognimuse.com" className="hover:text-foreground transition-colors">manoj@cognimuse.com</a>
            </p>
            <p>
              Phone: <a href="tel:+918861078009" className="hover:text-foreground transition-colors">88610 78009</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
