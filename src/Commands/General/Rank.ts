import { getStats } from '../../lib'
import { BaseCommand, Command, Message } from '../../Structures'

@Command('rank', {
    description: "Displays user's rank",
    category: 'general',
    exp: 20,
    cooldown: 10,
    aliases: ['card'],
    usage: 'rank [tag/quote user]'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        while (users.length < 1) users.push(M.sender.jid)
        const user = users[0]
        const username = user === M.sender.jid ? M.sender.username : this.client.contact.getContact(user).username
        let pfp: string | undefined
        try {
            pfp =
                (await this.client.profilePictureUrl(user, 'image')) ||
                'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
        } catch (error) {
            pfp = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
        }
        const { experience, level, tag } = await this.client.DB.getUser(user)
        const { requiredXpToLevelUp, rank } = getStats(level)
        const card = await this.client.utils.getBuffer(
            `https://weeb-api.up.railway.app/rank?pfp=${encodeURIComponent(
                pfp
            )}&level=${level}&experience=${experience}&tag=${tag}&username=${encodeURIComponent(
                username
            )}&xp=${requiredXpToLevelUp}&rank=${encodeURIComponent(rank)}&progress=${encodeURIComponent(
                this.client.utils.generateRandomHex()
            )}&bg=${encodeURIComponent(this.client.utils.generateRandomHex())}`
        )
        return void (await M.reply(
            card,
            'image',
            undefined,
            undefined,
            `🏮 *Username:* ${username}#${tag}\n\n🌟 *Experience: ${experience} / ${requiredXpToLevelUp}*\n\n🥇 *Rank:* ${rank}\n\n🍀 *Level:* ${level}`
        ))
    }
}
