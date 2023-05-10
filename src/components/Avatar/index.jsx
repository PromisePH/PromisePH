import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { bigSmile } from '@dicebear/collection';
function Avatar({ name, styles }) {
    const avatar = useMemo(() => {
        return createAvatar(bigSmile, {
            size: 32,
            seed: name,
            translateX: 0,
            translateY: 0,
            backgroundColor: ["ffffff"],
            accessories: ["sunglasses", "glasses"],
            accessoriesProbability: 10,
            hair: ["bangs", "froBun", "shortHair", "curlyShortHair", "straightHair", "wavyBob"],
            hairColor: ["220f00"],
            mouth: ["braces", "gapSmile", "kawaii", "openedSmile", "teethSmile"],
            skinColor: ["c99c62", "e2ba87", "efcc9f"]
        }).toDataUriSync();
    }, []);
    return (
        <img src={avatar} alt={name} className={styles} />
    );
}

export default Avatar;