import { promisify } from 'node:util';
import * as child_process from 'node:child_process';

import { Plugin, Notice } from 'obsidian';

import { GitSettings, DEFAULT_SETTINGS, GitSettingsTab } from './settings';


export default class GitPlugin extends Plugin {
    settings: GitSettings;

    async onload() {
        console.log('Loading Git Plugin');

        await this.loadSettings();
        this.addSettingTab(new GitSettingsTab(this.app, this));

        this.addCommand({
            id: 'git-pull',
            name: 'Git Pull',
            callback: () => this.pullGit()
        });
        this.addCommand({
            id: 'git-push',
            name: 'Git Push',
            callback: () => this.pushGit()
        });
        this.addCommand({
            id: 'git-commit',
            name: 'Git Commit',
            callback: () => this.commitGit()
        });
        this.addCommand({
            id: 'git-sync',
            name: 'Git Sync',
            callback: () => this.syncGit()
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }

    async pullGit(rebase: boolean = false) {
        try {
            const command = rebase ? 'git pull --rebase' : 'git pull';
            await this.execGitCommand(command);
            new Notice(`Pull successful`);
        } catch (error) {
            new Notice(`Git Pull Error: ${error.message}`);
        }
    }

    async pushGit() {
        try {
            await this.execGitCommand('git push');
            new Notice(`Push successful`);
        } catch (error) {
            new Notice(`Git Push Error: ${error.message}`);
        }
    }

    async commitGit(message: string = 'update') {
        try {
            await this.execGitCommand(`git add ${this.settings.pathSpec}`);
            await this.execGitCommand(`git commit -m "${message}"`);
            new Notice(`Commit successful`);
        } catch (error) {
            new Notice(`${error.message}`);
        }
    }

    async syncGit(message: string = 'update') {
        try {
            await this.execGitCommand('git pull --rebase');
            await this.execGitCommand(`git add ${this.settings.pathSpec}`);
            await this.execGitCommand(`git commit -m "${message}"`);
            await this.execGitCommand('git push');
            new Notice(`Sync successful`);
        } catch (error) {
            new Notice(`Git Sync Error: ${error.message}`);
        }
    }

    async execGitCommand(command: string): Promise<string> {
        const exec = promisify(child_process.exec);
        const { stdout } = await exec(command, {
            cwd: this.app.vault.adapter.getBasePath()
        });
        return stdout.trim();
    }
}