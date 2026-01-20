/**
 * About Component - Página sobre o ZFrame
 */

import {
    IconClipboardList,
    IconFolder,
    IconCloud,
    IconShieldLock,
    IconPalette,
    IconBrandReact,
    IconBrandTypescript,
    IconBolt,
    IconBrush,
    IconHandMove,
    IconDevices,
    IconX,
    IconArrowsUpDown,
    IconCheck,
} from '@tabler/icons-react';

interface AboutProps {
    onClose: () => void;
}

export function About({ onClose }: AboutProps) {
    return (
        <div className="glass-modal-overlay" onClick={onClose}>
            <div
                className="glass-modal about-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="about-header">
                    <div className="about-logo">
                        <IconClipboardList size={48} stroke={1.5} className="about-logo-icon" />
                        <h1 className="about-title">ZFrame</h1>
                    </div>
                    <button
                        className="glass-button icon-only"
                        onClick={onClose}
                        title="Fechar (Esc)"
                    >
                        <IconX size={18} stroke={1.5} />
                    </button>
                </div>

                <div className="about-content">
                    {/* Introdução */}
                    <section className="about-section">
                        <h2 className="about-section-title">O que é o ZFrame?</h2>
                        <p className="about-text">
                            ZFrame é um <strong>minimalist, repo-based task board for developers</strong>.
                            Lê e escreve arquivos diretamente do seu repositório. Sem servidor, sem login,
                            sem banco de dados — apenas você e seus arquivos.
                        </p>
                    </section>

                    {/* Conceitos */}
                    <section className="about-section">
                        <h2 className="about-section-title">💡 Conceitos Principais</h2>

                        <div className="concept-card glass-panel">
                            <h3 className="concept-title"><IconFolder size={20} stroke={1.5} style={{ display: 'inline', marginRight: '8px' }} />File-Based</h3>
                            <p className="concept-text">
                                Suas tarefas são armazenadas em arquivos <code>tasks.json</code> ou{' '}
                                <code>TASKS.md</code> no seu repositório. O ZFrame apenas lê e escreve
                                nesses arquivos — você mantém controle total dos seus dados.
                            </p>
                        </div>

                        <div className="concept-card glass-panel">
                            <h3 className="concept-title"><IconCloud size={20} stroke={1.5} style={{ display: 'inline', marginRight: '8px' }} />Offline-First</h3>
                            <p className="concept-text">
                                Funciona 100% offline como PWA (Progressive Web App). Todos os dados
                                ficam no seu computador. Sem dependência de internet ou servidores externos.
                            </p>
                        </div>

                        <div className="concept-card glass-panel">
                            <h3 className="concept-title"><IconShieldLock size={20} stroke={1.5} style={{ display: 'inline', marginRight: '8px' }} />Privacy-First</h3>
                            <p className="concept-text">
                                Zero telemetria, zero tracking, zero analytics. Seus dados nunca saem
                                do seu dispositivo. O que você faz no ZFrame fica no ZFrame.
                            </p>
                        </div>

                        <div className="concept-card glass-panel">
                            <h3 className="concept-title"><IconPalette size={20} stroke={1.5} style={{ display: 'inline', marginRight: '8px' }} />Glassmorphism</h3>
                            <p className="concept-text">
                                Interface moderna com efeitos de blur e transparência, criando
                                profundidade visual sem sacrificar legibilidade.
                            </p>
                        </div>
                    </section>

                    {/* Como Funciona */}
                    <section className="about-section">
                        <h2 className="about-section-title">⚙️ Como Funciona?</h2>

                        <div className="workflow-step">
                            <div className="workflow-number">1</div>
                            <div className="workflow-content">
                                <h4 className="workflow-title">Abrir Arquivo</h4>
                                <p className="workflow-text">
                                    Use o botão "Abrir" para selecionar um arquivo <code>tasks.json</code> ou{' '}
                                    <code>TASKS.md</code> do seu repositório. No Chrome/Edge, você terá
                                    permissão de leitura/escrita direta.
                                </p>
                            </div>
                        </div>

                        <div className="workflow-step">
                            <div className="workflow-number">2</div>
                            <div className="workflow-content">
                                <h4 className="workflow-title">Editar Visualmente</h4>
                                <p className="workflow-text">
                                    Arraste tarefas entre colunas, edite títulos, adicione tags e prioridades.
                                    Tudo em uma interface visual intuitiva.
                                </p>
                            </div>
                        </div>

                        <div className="workflow-step">
                            <div className="workflow-number">3</div>
                            <div className="workflow-content">
                                <h4 className="workflow-title">Salvar Automaticamente</h4>
                                <p className="workflow-text">
                                    Pressione <kbd>Ctrl+S</kbd> ou use o botão "Salvar". O arquivo é
                                    atualizado mantendo a formatação original (no caso de Markdown).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Arquitetura */}
                    <section className="about-section">
                        <h2 className="about-section-title">🏗️ Arquitetura</h2>
                        <div className="architecture-diagram">
                            <div className="arch-layer">
                                <div className="arch-box">📄 tasks.json / TASKS.md</div>
                            </div>
                            <div className="arch-arrow"><IconArrowsUpDown size={24} stroke={1.5} /></div>
                            <div className="arch-layer">
                                <div className="arch-box">🔌 Adapters (JSON/Markdown)</div>
                            </div>
                            <div className="arch-arrow"><IconArrowsUpDown size={24} stroke={1.5} /></div>
                            <div className="arch-layer">
                                <div className="arch-box">🧠 Core Domain (Board, Task, Column)</div>
                            </div>
                            <div className="arch-arrow"><IconArrowsUpDown size={24} stroke={1.5} /></div>
                            <div className="arch-layer">
                                <div className="arch-box">⚛️ React UI (Glassmorphism)</div>
                            </div>
                        </div>
                    </section>

                    {/* Tecnologias */}
                    <section className="about-section">
                        <h2 className="about-section-title">🛠️ Tecnologias</h2>
                        <div className="tech-grid">
                            <div className="tech-item">
                                <IconBrandReact className="tech-icon" size={48} stroke={1.5} />
                                <span className="tech-name">React 18</span>
                            </div>
                            <div className="tech-item">
                                <IconBrandTypescript className="tech-icon" size={48} stroke={1.5} />
                                <span className="tech-name">TypeScript</span>
                            </div>
                            <div className="tech-item">
                                <IconBolt className="tech-icon" size={48} stroke={1.5} />
                                <span className="tech-name">Vite</span>
                            </div>
                            <div className="tech-item">
                                <IconBrush className="tech-icon" size={48} stroke={1.5} />
                                <span className="tech-name">CSS Vanilla</span>
                            </div>
                            <div className="tech-item">
                                <IconHandMove className="tech-icon" size={48} stroke={1.5} />
                                <span className="tech-name">dnd-kit</span>
                            </div>
                            <div className="tech-item">
                                <IconDevices className="tech-icon" size={48} stroke={1.5} />
                                <span className="tech-name">PWA</span>
                            </div>
                        </div>
                    </section>

                    {/* Compatibilidade */}
                    <section className="about-section">
                        <h2 className="about-section-title">🌐 Compatibilidade</h2>
                        <table className="compat-table">
                            <thead>
                                <tr>
                                    <th>Browser</th>
                                    <th>File System API</th>
                                    <th>Modo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Chrome 86+</td>
                                    <td className="compat-yes"><IconCheck size={18} stroke={2} /></td>
                                    <td>Leitura/Escrita</td>
                                </tr>
                                <tr>
                                    <td>Edge 86+</td>
                                    <td className="compat-yes"><IconCheck size={18} stroke={2} /></td>
                                    <td>Leitura/Escrita</td>
                                </tr>
                                <tr>
                                    <td>Opera 72+</td>
                                    <td className="compat-yes"><IconCheck size={18} stroke={2} /></td>
                                    <td>Leitura/Escrita</td>
                                </tr>
                                <tr>
                                    <td>Firefox</td>
                                    <td className="compat-no"><IconX size={18} stroke={2} /></td>
                                    <td>Download/Upload</td>
                                </tr>
                                <tr>
                                    <td>Safari</td>
                                    <td className="compat-no"><IconX size={18} stroke={2} /></td>
                                    <td>Download/Upload</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* Footer */}
                    <section className="about-footer">
                        <p className="about-version">Versão 1.0.0</p>
                        <p className="about-license">MIT License © 2026</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
