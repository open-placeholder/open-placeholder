import { getGithubRepoData } from '@/utils/data';
import Image from 'next/image';

export default async function Home() {
  const { name, description } = await getGithubRepoData();

  const examples = [
    {
      title: 'Basic Rectangle',
      url: '/600x400',
      description: 'Specify width and height',
    },
    {
      title: 'Square Format',
      url: '/256',
      description: 'Single value creates a square',
    },
    {
      title: 'Custom Text',
      url: '/600x300/Hello%20World',
      description: 'Add custom text instead of dimensions',
    },
    {
      title: 'Large Banner',
      url: '/1200x400/Coming%20Soon',
      description: 'Perfect for hero sections',
    },
  ];

  return (
    <main className='w-full py-12 md:py-24 lg:py-32 font-sans bg-gray-800'>
      <div className='container px-4 md:px-6 mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white'>
            {name}
          </h1>
          <p className='mx-auto max-w-[700px] text-gray-300 md:text-xl mt-4'>
            {description}
          </p>
          <div className='flex items-center w-[170px] mx-auto mt-6'>
            <iframe
              src='https://ghbtns.com/github-btn.html?user=open-placeholder&repo=open-placeholder&type=star&count=true&size=large'
              width='170'
              height='30'
              title='GitHub'
            ></iframe>
          </div>
        </div>

        {/* Usage Section */}
        <div className='bg-gray-900 rounded-lg p-8 mb-12'>
          <h2 className='text-2xl font-bold text-white mb-6'>How to Use</h2>
          <div className='space-y-4'>
            <div className='bg-gray-800 rounded p-4'>
              <h3 className='text-lg font-semibold text-white mb-2'>
                Basic Usage
              </h3>
              <code className='text-green-400 bg-gray-950 px-2 py-1 rounded'>
                https://openplaceholder.com/[width]x[height]
              </code>
              <p className='text-gray-400 mt-2'>
                Replace [width] and [height] with your desired dimensions
              </p>
            </div>

            <div className='bg-gray-800 rounded p-4'>
              <h3 className='text-lg font-semibold text-white mb-2'>
                Square Images
              </h3>
              <code className='text-green-400 bg-gray-950 px-2 py-1 rounded'>
                https://openplaceholder.com/[size]
              </code>
              <p className='text-gray-400 mt-2'>
                Single value creates a square image
              </p>
            </div>

            <div className='bg-gray-800 rounded p-4'>
              <h3 className='text-lg font-semibold text-white mb-2'>
                Custom Text
              </h3>
              <code className='text-green-400 bg-gray-950 px-2 py-1 rounded'>
                https://openplaceholder.com/[width]x[height]/[text]
              </code>
              <p className='text-gray-400 mt-2'>
                Add custom text after dimensions (URL encode special characters)
              </p>
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <div className='mb-12'>
          <h2 className='text-2xl font-bold text-white mb-6 text-center'>
            Examples
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {examples.map((example) => (
              <div key={example.url} className='bg-gray-900 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-white mb-2'>
                  {example.title}
                </h3>
                <p className='text-gray-400 text-sm mb-3'>
                  {example.description}
                </p>
                <div className='mb-3'>
                  <code className='text-green-400 bg-gray-950 px-2 py-1 rounded text-sm break-all'>
                    {example.url}
                  </code>
                </div>
                <Image
                  className='w-full rounded'
                  unoptimized
                  src={example.url}
                  width={600}
                  height={example.url.includes('x') ? 400 : 600}
                  alt={example.title}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className='bg-gray-900 rounded-lg p-8 mb-12'>
          <h2 className='text-2xl font-bold text-white mb-6'>Features</h2>
          <ul className='space-y-2 text-gray-300'>
            <li className='flex items-start'>
              <span className='text-green-400 mr-2'>✓</span>
              <span>Dynamic image generation up to 4000x4000 pixels</span>
            </li>
            <li className='flex items-start'>
              <span className='text-green-400 mr-2'>✓</span>
              <span>Custom text support with automatic font sizing</span>
            </li>
            <li className='flex items-start'>
              <span className='text-green-400 mr-2'>✓</span>
              <span>Edge runtime for fast global performance</span>
            </li>
            <li className='flex items-start'>
              <span className='text-green-400 mr-2'>✓</span>
              <span>CDN-friendly with immutable cache headers</span>
            </li>
            <li className='flex items-start'>
              <span className='text-green-400 mr-2'>✓</span>
              <span>Clean, minimalist design with Geist font</span>
            </li>
            <li className='flex items-start'>
              <span className='text-green-400 mr-2'>✓</span>
              <span>Open source and self-hostable</span>
            </li>
          </ul>
        </div>

        {/* Deploy Section */}
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-white mb-4'>
            Deploy Your Own
          </h2>
          <p className='text-gray-300 mb-6'>
            Get your own placeholder image service in seconds
          </p>
          <a
            href='https://vercel.com/new/clone?repository-url=https://github.com/open-placeholder/open-placeholder'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors'
          >
            Deploy with Vercel
          </a>
        </div>

        {/* Footer */}
        <div className='text-center mt-16 pt-8 border-t border-gray-700'>
          <p className='text-gray-400'>
            Made with <span className='text-red-500'>♥</span> by{' '}
            <a
              href='https://akshit.io'
              target='_blank'
              rel='noopener noreferrer'
              className='text-white hover:text-green-400 transition-colors'
            >
              Akshit Kr Nagpal
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
