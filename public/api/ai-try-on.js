// Mock API endpoint for AI try-on (for demo purposes)
// In production, this would be replaced with actual AI service integration

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { clothing_image, user_image, category, item_id } = req.body;

  // Simulate API processing time
  setTimeout(() => {
    // Mock response - in production, this would call actual AI service
    const mockResponse = {
      success: true,
      result_image_url: `https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=400&h=600&overlay=${encodeURIComponent(clothing_image)}`,
      message: 'AI try-on completed successfully',
      processing_time: '3.2s'
    };

    res.status(200).json(mockResponse);
  }, 2000); // 2 second delay to simulate processing
}