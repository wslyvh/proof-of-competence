
import fs from 'fs'
import path from 'path'
import { resolve, join } from 'path'
import { Quest } from 'types'

export function getQuestNames(): Array<string> {
    const dir = resolve(process.cwd(), 'quests')
    const dirs = fs.readdirSync(dir, { withFileTypes: true })
        .filter(i => i.isFile() && i.name.endsWith('.json'))
        .map(i => i.name.replace('.json', ''))

    return dirs
}

export function getQuests(): Array<Quest> {
    const dir = resolve(process.cwd(), 'quests')
    const files = fs.readdirSync(dir, { withFileTypes: true })
        .filter(i => i.isFile() && i.name.endsWith('.json'))

    const items = files.map(i => {
        const fullPath = join(dir, i.name)
        const content = fs.readFileSync(fullPath, 'utf8')
        if (!content) {
            console.log('File has no content..', i.name)
        }
        
        if (content) {
            let quest = JSON.parse(content) as Quest 
            return {
                ...quest,
                id: i.name.replace('.json', '')
            }
        }
    }).filter(i => !!i) as Array<Quest>
    
    return items
}