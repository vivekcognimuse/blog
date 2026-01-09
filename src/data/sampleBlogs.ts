import { BlogPost } from '@/types/blog';
import coverMindfulness from '@/assets/cover-mindfulness.jpg';
import coverBooks from '@/assets/cover-books.jpg';
import coverFood from '@/assets/cover-food.jpg';
import coverPositive from '@/assets/cover-positive.jpg';

export const sampleBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Living in the Moment',
    description: 'Mindfulness enhances well-being by promoting present-moment awareness and acceptance.',
    emoji: '🧘',
    coverImage: coverMindfulness,
    tags: ['Mindfulness', 'Mental Health'],
    publishedDate: '2023-12-07',
    isPublished: true,
    blocks: [
      {
        id: 'b1-1',
        type: 'heading1',
        content: 'The Art of Living in the Moment',
        emoji: '🧘'
      },
      {
        id: 'b1-2',
        type: 'heading2',
        content: 'What is Mindfulness?',
        emoji: '✨'
      },
      {
        id: 'b1-3',
        type: 'paragraph',
        content: 'Mindfulness is the practice of being fully present and engaged in the current moment. It involves paying attention to your thoughts, feelings, and surroundings without judgment.'
      },
      {
        id: 'b1-4',
        type: 'divider',
        content: ''
      },
      {
        id: 'b1-5',
        type: 'heading2',
        content: 'Benefits of Mindfulness',
        emoji: '🌟'
      },
      {
        id: 'b1-6',
        type: 'bulletList',
        content: 'Reduces stress and anxiety\nImproves focus and concentration\nEnhances emotional regulation\nPromotes better sleep quality'
      },
      {
        id: 'b1-7',
        type: 'callout',
        content: 'Start with just 5 minutes of meditation each day. Consistency matters more than duration.',
        emoji: '💡'
      }
    ]
  },
  {
    id: '2',
    title: 'My Top 10 Books and Why I Love Them',
    description: 'The author shares their top 10 impactful books and their significance.',
    emoji: '📚',
    coverImage: coverBooks,
    tags: ['Books', 'Learning'],
    publishedDate: '2023-10-11',
    isPublished: true,
    blocks: [
      {
        id: 'b2-1',
        type: 'heading1',
        content: 'My Top 10 Books and Why I Love Them',
        emoji: '📚'
      },
      {
        id: 'b2-2',
        type: 'paragraph',
        content: 'Books have the power to transform our perspectives, challenge our assumptions, and inspire us to become better versions of ourselves. Here are my top 10 picks that have profoundly influenced my thinking.'
      },
      {
        id: 'b2-3',
        type: 'heading2',
        content: '1. Atomic Habits by James Clear',
        emoji: '⚡'
      },
      {
        id: 'b2-4',
        type: 'paragraph',
        content: 'This book revolutionized how I think about building habits. The concept of 1% improvements compounding over time is incredibly powerful.'
      },
      {
        id: 'b2-5',
        type: 'quote',
        content: '"You do not rise to the level of your goals. You fall to the level of your systems."'
      },
      {
        id: 'b2-6',
        type: 'heading2',
        content: '2. Deep Work by Cal Newport',
        emoji: '🎯'
      },
      {
        id: 'b2-7',
        type: 'paragraph',
        content: 'In our distraction-filled world, the ability to focus deeply is becoming increasingly rare and valuable. This book provides a blueprint for cultivating that skill.'
      }
    ]
  },
  {
    id: '3',
    title: 'Exploring New Cuisines',
    description: 'The blog chronicles personal culinary adventures exploring diverse global cuisines.',
    emoji: '🍜',
    coverImage: coverFood,
    tags: ['Food', 'Travel'],
    publishedDate: '2023-09-15',
    isPublished: true,
    blocks: [
      {
        id: 'b3-1',
        type: 'heading1',
        content: 'Exploring New Cuisines',
        emoji: '🍜'
      },
      {
        id: 'b3-2',
        type: 'paragraph',
        content: 'Food is more than sustenance—it\'s a gateway to understanding cultures, histories, and the people who create these culinary masterpieces.'
      },
      {
        id: 'b3-3',
        type: 'heading2',
        content: 'Thai Street Food Adventures',
        emoji: '🌶️'
      },
      {
        id: 'b3-4',
        type: 'paragraph',
        content: 'The bustling night markets of Bangkok offer an incredible array of flavors. From the tangy som tam to the comforting warmth of tom yum, each dish tells a story.'
      },
      {
        id: 'b3-5',
        type: 'numberedList',
        content: 'Pad Thai from Thip Samai\nMango Sticky Rice at Mae Varee\nBoat Noodles at Victory Monument'
      }
    ]
  },
  {
    id: '4',
    title: 'The Power of Positive Thinking',
    description: 'Positive thinking transforms lives and enhances mental and physical health.',
    emoji: '☀️',
    coverImage: coverPositive,
    tags: ['Psychology', 'Lifestyle'],
    publishedDate: '2023-08-22',
    isPublished: true,
    blocks: [
      {
        id: 'b4-1',
        type: 'heading1',
        content: 'The Power of Positive Thinking',
        emoji: '☀️'
      },
      {
        id: 'b4-2',
        type: 'heading2',
        content: 'Why Mindset Matters',
        emoji: '🧠'
      },
      {
        id: 'b4-3',
        type: 'paragraph',
        content: 'Our thoughts shape our reality. When we cultivate a positive mindset, we open ourselves to possibilities, resilience, and growth.'
      },
      {
        id: 'b4-4',
        type: 'callout',
        content: 'Remember: Positive thinking isn\'t about ignoring problems—it\'s about approaching challenges with a solution-oriented mindset.',
        emoji: '💭'
      },
      {
        id: 'b4-5',
        type: 'heading2',
        content: 'Daily Practices',
        emoji: '🌱'
      },
      {
        id: 'b4-6',
        type: 'bulletList',
        content: 'Morning gratitude journaling\nPositive affirmations\nSurrounding yourself with supportive people\nCelebrating small wins'
      }
    ]
  }
];

export const allTags = [
  'Books',
  'Learning',
  'Food',
  'Travel',
  'Mindfulness',
  'Mental Health',
  'Psychology',
  'Lifestyle'
];
