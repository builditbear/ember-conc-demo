import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PokedataPanelComponent extends Component {
    @tracked pokemonData = [];
    @tracked searchQuery = '';

    generateRandomIds(quantity) {
        const numberOfKnownPokemon = 1010;
        const randomPokemonIds = [];
        for (let i = 0; i < quantity; i++) {
            const randomId =
                Math.floor(Math.random() * numberOfKnownPokemon) + 1;
            randomPokemonIds.push(randomId);
        }

        return randomPokemonIds;
    }

    @action
    async fetchPokemon(pokemonNameOrId) {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`
        );
        const data = await response.json();
        return data;
    }
    @action
    async getRandomPokemonTeam(teamSize) {
        const pokemonTeam = [];
        const teamIds = this.generateRandomIds(teamSize);

        await Promise.all(
            teamIds.map(async (id) => {
                const pokemon = await this.fetchPokemon(id);
                pokemonTeam.push(pokemon);
            })
        );

        this.pokemonData = pokemonTeam;
    }
    @action
    async searchPokemon() {
        this.pokemonData = [await this.fetchPokemon(this.searchQuery)];
    }
}
