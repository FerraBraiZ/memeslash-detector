# Memeslash Detector

Scans packets to detect dream slashes projectile hitting the same target multiple times.

## :heavy_exclamation_mark: Disclaimer :heavy_exclamation_mark:

This module uses a repeat threshold of S_EACH_SKILL_RESULT packets from a dream slash projectile on the same target.
You can configure this threshold inside the module here:
```js
    /* If a target is hit by this amount or more times from the same dream slash projectile, it will warn his name.
       This is an arbitrary threshold, theoretically this threshold should be equal to two, but as I've seen,
       there are times where you receive the packet of S_EACH_SKILL_RESULT more than once for the same target for some reason.
       This is not a 100% guarantee that the person is using memeslash and shouldn't be considered as proof,
       unless you see a high value of hit counts, so please do not accuse someone of doing it without real video proof! */
    const repeatThreshold = 5;
```
