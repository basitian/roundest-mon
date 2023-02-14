import { useState } from 'react';
import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import { RouterOutput } from './api/trpc/[trpc]';

import Image from 'next/image';

export default function Home() {
	const [ids, setIds] = useState(() => getOptionsForVote());

	const [first, second] = ids;

	const firstPokemon = trpc.getPokemonById.useQuery({ id: first });
	const secondPokemon = trpc.getPokemonById.useQuery({ id: second });

	const voteMutation = trpc.castVote.useMutation();

	function voteForRoundest(selected: number) {
		if (selected === first) {
			voteMutation.mutate({ votedFor: first, votedAgainst: second });
		} else {
			voteMutation.mutate({ votedFor: second, votedAgainst: first });
		}
		setIds(getOptionsForVote());
	}

	return (
		<div className='h-screen w-screen flex flex-col justify-center items-center'>
			<div className=' text-2xl text-center'>Which Pokémon is Rounder?</div>
			<div className='p-2' />
			<div className='border rounded p-8 flex justify-between max-w-2xl items-center'>
				{!firstPokemon.isLoading &&
					firstPokemon.data &&
					!secondPokemon.isLoading &&
					secondPokemon.data && (
						<>
							<PokemonListing
								pokemon={firstPokemon.data}
								vote={() => voteForRoundest(first)}
							/>
							<div className='p-8 text-2xl'>Vs</div>
							<PokemonListing
								pokemon={secondPokemon.data}
								vote={() => voteForRoundest(second)}
							/>
						</>
					)}
				<div className='p-2' />
			</div>
		</div>
	);
}

type PokemonFromServer = RouterOutput['getPokemonById'];

const PokemonListing: React.FC<{
	pokemon: PokemonFromServer;
	vote: () => void;
}> = (props) => {
	return (
		<div className='flex flex-col'>
			<Image
				alt={props.pokemon.name}
				src={props.pokemon.sprite!}
				width={256}
				height={256}
			/>
			<div className='text-center text-xl capitalize mt-[-2rem]'>
				{props.pokemon.name}
			</div>
			<div className='p-2' />
			<button
				onClick={() => props.vote()}
				className='border-2 rounded p-2 hover:bg-white hover:text-gray-800'
			>
				Rounder
			</button>
		</div>
	);
};
