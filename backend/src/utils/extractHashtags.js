const extractHashtags = (caption) => {
  if (!caption) return [];

  const hashtags = caption.match(/#\w+/g);

  return hashtags ? hashtags.map((tag) => tag.toLowerCase()) : [];
};

module.exports = extractHashtags;
