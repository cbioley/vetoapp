export const ON_TOTAL_VOTES = 'ON_TOTAL_VOTES';

export function onTotalVotes(country, totalVotes) {
  return {
    type: ON_TOTAL_VOTES,
    payload: { country, totalVotes }
  };
}
