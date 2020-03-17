import * as seedrandom from 'seedrandom';

import { IFixture, IParser } from '../interface';

export class ReferenceParser implements IParser {
    /**
     * @type {number}
     */
    public priority = 50;

    private readonly random: seedrandom.prng;

    constructor() {
        this.random = seedrandom('typeorm-fixtures-cli');
    }

    /**
     * @param {string} value
     * @return {boolean}
     */
    isSupport(value: string): boolean {
        return value.indexOf('@') === 0;
    }

    /**
     * @param {string} value
     * @param {IFixture} fixture
     * @param entities
     * @return {any}
     */
    parse(value: string, fixture: IFixture, entities: any): any {
        let result;

        if (value.substr(value.length - 1) === '*') {
            const prefix = value.substr(1, value.length - 1);
            const regex = new RegExp(`^${prefix}([0-9]+)$`);
            const maskEntities = Object.keys(entities).filter((s: string) => regex.test(s));
            const randomIndex = Math.floor(this.random() * maskEntities.length);
            result = entities[maskEntities[randomIndex]];
        } else {
            result = entities[value.substr(1)];
        }

        if (!result) {
            throw new Error(`Reference "${value}" not found`);
        }

        return result;
    }
}
