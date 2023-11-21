import MallePlayer from "./malle-player.ts";

interface MallePlayerTest {
    player: MallePlayer
}

const testIt = it.extend<MallePlayerTest>({
    player: new MallePlayer()
})

describe('MallePlayer', () => {

    beforeEach((context) => {
        // oh fuck it, I need to mock Output now...
        // context.player.updateNotes()
    });

    testIt('handles getNotesIn', () => {

    });

});
