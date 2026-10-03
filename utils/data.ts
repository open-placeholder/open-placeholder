import { z } from 'zod';
import { pascal } from 'radash';

const schema = z
  .object({
    name: z.string().transform(pascal),
    description: z.string(),
    stargazers_count: z.number(),
    topics: z.array(z.string()),
  })
  .transform(({ stargazers_count, ...data }) => ({
    ...data,
    stargazersCount: stargazers_count,
  }));

export const getGithubRepoData = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/open-placeholder/open-placeholder`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );
    
    if (!response.ok) {
      // Return fallback data if API fails
      return {
        name: 'Open Placeholder',
        description: 'A fast, simple, and customizable placeholder image service',
        stargazersCount: 0,
        topics: ['placeholder', 'image-generation', 'nextjs'],
      };
    }
    
    const data = await response.json();
    return schema.parse(data);
  } catch (error) {
    // Return fallback data on any error (rate limit, network, etc.)
    return {
      name: 'Open Placeholder',
      description: 'A fast, simple, and customizable placeholder image service',
      stargazersCount: 0,
      topics: ['placeholder', 'image-generation', 'nextjs'],
    };
  }
};
