import { useState } from 'react';
import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';

export default function Home() {
	const [ids, setIds] = useState(() => getOptionsForVote());

	const [first, second] = ids;

	const firstPokemon = trpc.getPokemonById.useQuery({ id: first });
	const secondPokemon = trpc.getPokemonById.useQuery({ id: second });

	if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

	return (
		<div className='h-screen w-screen flex flex-col justify-center items-center'>
			<div className=' text-2xl text-center'>Which Pokémon is Rounder?</div>
			<div className='p-2' />
			<div className='border rounded p-8 flex justify-between max-w-2xl items-center'>
				<div className='w-64 h-64 flex flex-col'>
					<img src={firstPokemon.data!.sprite!} className='w-full' />
					<div className='text-center text-xl capitalize mt-[-2rem]'>
						{firstPokemon.data?.name}
					</div>
				</div>
				<div className='p-8'>Vs</div>
				<div className='w-64 h-64 flex flex-col'>
					<img src={secondPokemon.data!.sprite!} className='w-full' />
					<div className='text-center text-xl capitalize mt-[-2rem]'>
						{secondPokemon.data?.name}
					</div>
				</div>
				<div className='p-2' />
			</div>
		</div>
	);
}
