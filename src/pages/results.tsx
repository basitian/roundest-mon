import { prisma } from '@/server/utils/prisma';
import { AsyncReturnType } from '@/utils/ts-bs';
import { GetStaticProps } from 'next';

import Image from 'next/image';

const getPokemonOrdered = async () => {
	return await prisma.pokemon.findMany({
		orderBy: {
			votesFor: { _count: 'desc' },
		},
		select: {
			id: true,
			name: true,
			spriteUrl: true,
			_count: {
				select: {
					votesFor: true,
					votesAgainst: true,
				},
			},
		},
	});
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonOrdered>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
	const { votesAgainst, votesFor } = pokemon._count;
	if (votesFor + votesAgainst === 0) return 0;
	return (votesFor / (votesFor + votesAgainst)) * 100;
};

const PokemonListing: React.FC<{
	pokemon: PokemonQueryResult[number];
	index: number;
}> = ({ pokemon, index }) => {
	return (
		<div className='flex border-b p-2 items-center justify-between'>
			<div className='flex items-center pl-2'>
				<p>{index + '.'}</p>
				<Image
					alt={pokemon.name}
					src={pokemon.spriteUrl}
					width={64}
					height={64}
				/>
				<div className='capitalize'>{pokemon.name}</div>
			</div>
			<div className='pr-4'>{generateCountPercent(pokemon) + '%'}</div>
		</div>
	);
};

const ResultsPage: React.FC<{
	pokemon: PokemonQueryResult;
}> = (props) => {
	return (
		<div className='flex flex-col items-center'>
			<h2 className='text-2xl p-4'>Results</h2>
			<div className='w-full max-w-2xl border'>
				{props.pokemon.map((currentPokemon, index) => (
					<PokemonListing
						pokemon={currentPokemon}
						index={index + 1}
						key={currentPokemon.id}
					/>
				))}
			</div>
		</div>
	);
};

export default ResultsPage;

export const getStaticProps: GetStaticProps = async () => {
	const pokemonOrdered = await getPokemonOrdered();

	return {
		props: {
			pokemon: pokemonOrdered,
		},
		revalidate: 60,
	};
};
