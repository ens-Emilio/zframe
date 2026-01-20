/**
 * FilterPanel Component - Painel de filtros por tag, status e prioridade
 */

import { useMemo } from 'react';
import type { Board, Priority } from '../core/types';

interface FilterPanelProps {
    board: Board;
    tagFilter: string[];
    priorityFilter: Priority[];
    onTagFilterChange: (tags: string[]) => void;
    onPriorityFilterChange: (priorities: Priority[]) => void;
    onClearFilters: () => void;
}

const priorities: Priority[] = ['P1', 'P2', 'P3', 'P4'];

export function FilterPanel({
    board,
    tagFilter,
    priorityFilter,
    onTagFilterChange,
    onPriorityFilterChange,
    onClearFilters,
}: FilterPanelProps) {
    // Extrai todas as tags únicas do board
    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        for (const column of board.columns) {
            for (const task of column.tasks) {
                for (const tag of task.tags) {
                    tagsSet.add(tag);
                }
            }
        }
        return Array.from(tagsSet).sort();
    }, [board]);

    const hasActiveFilters = tagFilter.length > 0 || priorityFilter.length > 0;

    const toggleTag = (tag: string) => {
        if (tagFilter.includes(tag)) {
            onTagFilterChange(tagFilter.filter((t) => t !== tag));
        } else {
            onTagFilterChange([...tagFilter, tag]);
        }
    };

    const togglePriority = (priority: Priority) => {
        if (priorityFilter.includes(priority)) {
            onPriorityFilterChange(priorityFilter.filter((p) => p !== priority));
        } else {
            onPriorityFilterChange([...priorityFilter, priority]);
        }
    };

    if (allTags.length === 0) {
        return null;
    }

    return (
        <div className="filter-panel glass-panel">
            <div className="filter-panel-header">
                <span className="filter-panel-title">🔍 Filtros</span>
                {hasActiveFilters && (
                    <button
                        className="filter-clear-btn"
                        onClick={onClearFilters}
                        title="Limpar filtros"
                    >
                        ✕ Limpar
                    </button>
                )}
            </div>

            {/* Prioridade */}
            <div className="filter-section">
                <span className="filter-section-title">Prioridade</span>
                <div className="filter-chips">
                    {priorities.map((p) => (
                        <button
                            key={p}
                            className={`filter-chip priority ${p.toLowerCase()} ${priorityFilter.includes(p) ? 'active' : ''
                                }`}
                            onClick={() => togglePriority(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
                <div className="filter-section">
                    <span className="filter-section-title">Tags</span>
                    <div className="filter-chips">
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                className={`filter-chip tag ${tagFilter.includes(tag) ? 'active' : ''
                                    }`}
                                onClick={() => toggleTag(tag)}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
