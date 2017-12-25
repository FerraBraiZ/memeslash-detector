const Command = require('command');

module.exports = function MemeslashDetector(dispatch) {
    const command = Command(dispatch);

    /* If a target is hit by this amount or more times from the same dream slash projectile, it will warn his name.
       This is an arbitrary threshold, theoretically this threshold should be equal to two, but as I've seen,
       there are times where you receive the packet of S_EACH_SKILL_RESULT more than once for the same target for some reason.
       This is not a 100% guarantee that the person is using memeslash and shouldn't be considered as proof,
       unless you see a high value of hit counts, so please do not accuse someone of doing it without real video proof! */
    const repeatThreshold = 5;

    // Dream Slash XI skill ids from https://github.com/neowutran/TeraDpsMeterData/blob/master/skills/skills-NA.tsv
    const skillIds = [106100, 106120, 106130, 101100, 101120, 101130, 101199];

    // CreatureID - Name
    const valkyriesMap = new Map();

    // ProjectileID - OwnerID
    const projectileMap = new Map();


    // ProjectileID - HitCountMap
    const projectileHitCountMap = new Map();

	dispatch.hook('S_SPAWN_USER', 11, (event) => {
        if ((event.model - 10101) % 100 == 12) {
            valkyriesMap.set(event.gameId.toString(), event.name);
        }
	});

	dispatch.hook('S_START_USER_PROJECTILE', 4, event => {
		if (skillIds.includes(event.skill) && valkyriesMap.has(event.gameId.toString())) {
			projectileMap.set(event.id.toString(), event.gameId.toString());
			projectileHitCountMap.set(event.id.toString(), new Map());
		}
	});

	dispatch.hook('S_EACH_SKILL_RESULT', 4, event => {
		if (event.owner.notEquals(0) && projectileHitCountMap.has(event.source.toString())) {
			const hitCountMap = projectileHitCountMap.get(event.source.toString());

			let hitCount = hitCountMap.get(event.target.toString());
			if (!hitCount) hitCount = 0;

			hitCountMap.set(event.target.toString(), hitCount + 1);
		}
	});

	dispatch.hook('S_END_USER_PROJECTILE', 3, event => {
		if (projectileHitCountMap.has(event.id.toString())) {
			const hitCountMap = projectileHitCountMap.get(event.id.toString());

			let maxHitCount = -Infinity;
			for (const hitCount of hitCountMap.values()) {
				maxHitCount = Math.max(maxHitCount, hitCount);
			}

			if (maxHitCount >= repeatThreshold) {
				const msg = `[Memeslash Detector] Detected ${valkyriesMap.get(projectileMap.get(event.id.toString()))} memeslashing with ${maxHitCount} hits to a single target.`;
				command.message(msg);
				console.log(msg);
			}
			projectileMap.delete(event.id.toString());
			projectileHitCountMap.delete(event.id.toString());
		}
	});
}
