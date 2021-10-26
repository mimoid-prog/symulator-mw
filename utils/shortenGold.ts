const shortenGold = (gold: number) => {
  return gold >= 1000000 ? `${gold / 1000000}m` : `${gold / 1000}k`;
};

export default shortenGold;
