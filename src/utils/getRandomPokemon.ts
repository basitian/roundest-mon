const MAX_DEX_ID = 493;

export function getRandomPokemon(notThisOne?: number): number {
	const pokedexNumber = Math.floor(Math.random() * MAX_DEX_ID + 1);

	if (pokedexNumber !== notThisOne) return pokedexNumber;
	return getRandomPokemon(notThisOne);
}

export function getOptionsForVote() {
	const firstId = getRandomPokemon();
	const secondId = getRandomPokemon(firstId);

	return [firstId, secondId];
}
