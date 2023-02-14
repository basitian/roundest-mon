import { useState } from 'react';
import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import { RouterOutput } from './api/trpc/[trpc]';

import Image from 'next/image';
import Link from 'next/link';

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

	const dataLoaded =
		!firstPokemon.isLoading &&
		firstPokemon.data &&
		!secondPokemon.isLoading &&
		secondPokemon.data;

	return (
		<div className='h-screen w-screen flex flex-col justify-between items-center relative'>
			<div className=' text-2xl text-center pt-8'>
				Which Pokémon is Rounder?
			</div>
			{dataLoaded && (
				<div className='border rounded p-8 flex justify-between max-w-2xl items-center'>
					<PokemonListing
						pokemon={firstPokemon.data}
						vote={() => voteForRoundest(first)}
					/>
					<div className='p-8 text-2xl'>Vs</div>
					<PokemonListing
						pokemon={secondPokemon.data}
						vote={() => voteForRoundest(second)}
					/>

					<div className='p-2' />
				</div>
			)}
			{!dataLoaded && <img src='/rings.svg' className='w-40' />}
			<div className='bottom-0 w-full text-xl text-center pb-2'>
				<a href='https://github.com/basitian/roundest-mon'>Github</a>
				{' | '}
				<Link href='/results'>Results</Link>
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
				src={props.pokemon.spriteUrl}
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
