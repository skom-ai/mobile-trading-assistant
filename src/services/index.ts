/**
 * Filename:    index.ts
 * Description: Barrel export for the services layer.
 * Purpose:     Home for API clients, data providers, and side-effectful adapters
 *              (market feeds, news, LLM). All external calls live here per project
 *              convention. Populated in a later wave.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

export * from './repository';
export * from './dataRepositories';
export * from './geminiService';
export * from './apiConfig';
export * from './apiClient';
export * from './liveRepositories';
