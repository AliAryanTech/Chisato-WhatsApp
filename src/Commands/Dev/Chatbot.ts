import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('chatbot', {
    description: 'enable/disable private message chat bot feature',
    category: 'dev',
    usage: 'chatbot true',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const key = context.toLowerCase().trim()
        const action = key === 'true' ? true : false
        await this.client.DB.updateFeature('chatbot', action)
        return void M.reply(`${action === true ? '🟩' : '🟥'} ${action === true ? 'Enabled' : 'Disabled'}`)
    }
}
