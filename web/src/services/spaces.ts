
import fs from 'fs'
import { join } from 'path'
import { Space } from 'types'

const baseFolder = 'src/spaces'

export function getSpaceNames(): Array<string> {
    const dir = join(process.cwd(), baseFolder)
    const dirs = fs.readdirSync(dir, { withFileTypes: true })
        .filter(i => i.isFile() && i.name.endsWith('.json'))
        .map(i => i.name.replace('.json', ''))

    return dirs
}

export function getSpaces(): Array<Space> {
    const dir = join(process.cwd(), baseFolder)
    const files = fs.readdirSync(dir, { withFileTypes: true })
        .filter(i => i.isFile() && i.name.endsWith('.json'))

    const items = files.map(i => {
        const fullPath = join(dir, i.name)
        const content = fs.readFileSync(fullPath, 'utf8')
        if (!content) {
            console.log('File has no content..', i.name)
        }
        
        if (content) {
            let space = JSON.parse(content) as Space 
            return {
                ...space,
                id: i.name.replace('.json', '')
            }
        }
    }).filter(i => !!i) as Array<Space> 
    
    return items
}