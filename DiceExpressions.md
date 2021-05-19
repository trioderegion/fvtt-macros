# dnd5e

## Homebrew functionality

### Scaling Die based on HP (half HP is d10, above is d8)
`1d(8+2*(1-floor(@attributes.hp.value*2/(@attributes.hp.max+1)))`

## Classes - Bard

### Bardic Inspiration Size
`1d(2*floor(@classes.bard.levels/5)+6)`

## Classes - Monk

### Martial Arts die expression
`1d(4+2*floor((@classes.monk.levels + 1) / 6))`

## Classes - Cleric

### Cleric channel divinity progression 
`floor(3*log(@classes.cleric.levels)+.5)`
