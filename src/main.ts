import { Plugin, Notice } from 'obsidian';

import { GitSettings, DEFAULT_SETTINGS, GitSettingsTab } from './settings';
import { pullGit, pushGit, commitGit, syncGit } from './utils';


export default class GitPlugin extends Plugin {
    settings: GitSettings;

    async onload() {
        console.log('Loading Git Plugin');

        await this.loadSettings();
        this.addSettingTab(new GitSettingsTab(this.app, this));

        this.addCommand({
            id: 'git-pull',
            name: 'Git Pull',
            callback: () => {
                pullGit(this.app.vault.adapter.getBasePath())
                    .then(() => new Notice('Git Pull successful'))
                    .catch((error) => new Notice(`Git Pull failed: ${error.message}`))
            }
        });
        this.addCommand({
            id: 'git-push',
            name: 'Git Push',
            callback: () => {
                pushGit(this.app.vault.adapter.getBasePath())
                    .then(() => new Notice('Git Push successful'))
                    .catch((error) => new Notice(`Git Push failed: ${error.message}`))
            }
        });
        this.addCommand({
            id: 'git-commit',
            name: 'Git Commit',
            callback: () => {
                commitGit(this.app.vault.adapter.getBasePath())
                    .then(() => new Notice('Git Commit successful'))
                    .catch((error) => new Notice(`Git Commit failed: ${error.message}`))
            }
        });
        this.addCommand({
            id: 'git-sync',
            name: 'Git Sync',
            callback: () => {
                syncGit(this.app.vault.adapter.getBasePath())
                    .then(() => new Notice('Git Sync successful'))
                    .catch((error) => new Notice(`Git Sync failed: ${error.message}`))
            }
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
}