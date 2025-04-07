document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const webhookUrlInput = document.getElementById('webhook-url');
    const usernameInput = document.getElementById('username');
    const avatarUrlInput = document.getElementById('avatar-url');
    const contentInput = document.getElementById('content');
    const messageImageUrlInput = document.getElementById('message-image-url');
    const embedList = document.getElementById('embed-list');
    const addEmbedButton = document.getElementById('add-embed');
    const sendWebhookButton = document.getElementById('send-webhook');
    const saveWebhookButton = document.getElementById('save-webhook');
    const clearFormButton = document.getElementById('clear-form');
    const discordPreview = document.querySelector('.discord-preview');

    // Contadores para IDs únicos
    let embedCounter = 1;
    let fieldCounter = 1;

    // Inicializar eventos
    initializeEvents();
    updatePreview();

    // Função para inicializar todos os event listeners
    function initializeEvents() {
        // Event listeners para inputs principais
        webhookUrlInput.addEventListener('input', updatePreview);
        usernameInput.addEventListener('input', updatePreview);
        avatarUrlInput.addEventListener('input', updatePreview);
        contentInput.addEventListener('input', updatePreview);
        messageImageUrlInput.addEventListener('input', updatePreview);

        // Event listeners para botões principais
        addEmbedButton.addEventListener('click', addNewEmbed);
        sendWebhookButton.addEventListener('click', sendWebhook);
        saveWebhookButton.addEventListener('click', saveWebhookConfig);
        clearFormButton.addEventListener('click', clearForm);

        // Adicionar event listeners para embeds existentes
        setupExistingEmbedListeners();
    }

    // Configurar listeners para embeds existentes
    function setupExistingEmbedListeners() {
        // Para cada embed existente
        document.querySelectorAll('.embed-item').forEach(embed => {
            const embedId = embed.dataset.embedId;
            
            // Botões de ação do embed
            const moveUpButton = embed.querySelector('.embed-actions button:nth-child(1)');
            const moveDownButton = embed.querySelector('.embed-actions button:nth-child(2)');
            const removeButton = embed.querySelector('.embed-actions button:nth-child(3)');
            
            moveUpButton.addEventListener('click', () => moveEmbed(embed, 'up'));
            moveDownButton.addEventListener('click', () => moveEmbed(embed, 'down'));
            removeButton.addEventListener('click', () => removeEmbed(embed));
            
            // Inputs do embed
            const colorInput = embed.querySelector(`#embed-color-${embedId}`);
            const titleInput = embed.querySelector(`#embed-title-${embedId}`);
            const descriptionInput = embed.querySelector(`#embed-description-${embedId}`);
            const imageUrlInput = embed.querySelector(`#embed-image-url-${embedId}`);
            const footerInput = embed.querySelector(`#embed-footer-${embedId}`);
            
            colorInput.addEventListener('input', updatePreview);
            titleInput.addEventListener('input', updatePreview);
            descriptionInput.addEventListener('input', updatePreview);
            imageUrlInput.addEventListener('input', updatePreview);
            footerInput.addEventListener('input', updatePreview);
            
            // Botão para adicionar campo
            const addFieldButton = embed.querySelector('.secondary-button');
            addFieldButton.addEventListener('click', () => addFieldToEmbed(embed));
            
            // Configurar listeners para campos existentes
            setupFieldListeners(embed);
        });
    }

    // Configurar listeners para campos de embed existentes
    function setupFieldListeners(embedElement) {
        embedElement.querySelectorAll('.field-group').forEach(field => {
            const removeButton = field.querySelector('.field-group-actions button');
            const nameInput = field.querySelector('input[type="text"]');
            const valueInput = field.querySelector('textarea');
            const inlineCheckbox = field.querySelector('input[type="checkbox"]');
            
            removeButton.addEventListener('click', () => removeField(field));
            nameInput.addEventListener('input', updatePreview);
            valueInput.addEventListener('input', updatePreview);
            inlineCheckbox.addEventListener('change', updatePreview);
        });
    }

    // Adicionar novo embed
    function addNewEmbed() {
        embedCounter++;
        
        const embedTemplate = `
        <div class="embed-item" data-embed-id="${embedCounter}">
            <div class="embed-actions">
                <button class="icon-button" title="Mover para cima">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                </button>
                <button class="icon-button" title="Mover para baixo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <button class="icon-button" title="Remover embed">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
            
            <div class="input-group">
                <label for="embed-title-${embedCounter}">
                    <span class="color-preview" style="background-color: #ff3232;"></span>
                    Cor e Título
                </label>
                <div class="field-row">
                    <div class="field-col">
                        <input type="color" id="embed-color-${embedCounter}" value="#ff3232">
                    </div>
                    <div class="field-col" style="flex: 5;">
                        <input type="text" id="embed-title-${embedCounter}" placeholder="Título do embed">
                    </div>
                </div>
            </div>
            
            <div class="input-group">
                <label for="embed-description-${embedCounter}">Descrição</label>
                <textarea id="embed-description-${embedCounter}" rows="3" placeholder="Descrição do embed..."></textarea>
            </div>
            
            <div class="input-group">
                <label for="embed-image-url-${embedCounter}">URL da Imagem do Embed (opcional)</label>
                <input type="url" id="embed-image-url-${embedCounter}" placeholder="https://exemplo.com/imagem-embed.png">
            </div>
            
            <div class="divider"></div>
            
            <h4>Campos</h4>
            <div class="fields-container">
                <!-- Os campos serão adicionados aqui -->
            </div>
            
            <button class="secondary-button" style="width: 100%;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Adicionar Campo
            </button>
            
            <div class="divider"></div>
            
            <div class="input-group">
                <label for="embed-footer-${embedCounter}">Rodapé</label>
                <input type="text" id="embed-footer-${embedCounter}" placeholder="Texto do rodapé">
            </div>
        </div>
        `;
        
        embedList.insertAdjacentHTML('beforeend', embedTemplate);
        
        // Configurar event listeners para o novo embed
        const newEmbed = embedList.lastElementChild;
        const embedId = newEmbed.dataset.embedId;
        
        // Botões de ação do embed
        const moveUpButton = newEmbed.querySelector('.embed-actions button:nth-child(1)');
        const moveDownButton = newEmbed.querySelector('.embed-actions button:nth-child(2)');
        const removeButton = newEmbed.querySelector('.embed-actions button:nth-child(3)');
        
        moveUpButton.addEventListener('click', () => moveEmbed(newEmbed, 'up'));
        moveDownButton.addEventListener('click', () => moveEmbed(newEmbed, 'down'));
        removeButton.addEventListener('click', () => removeEmbed(newEmbed));
        
        // Inputs do embed
        const colorInput = newEmbed.querySelector(`#embed-color-${embedId}`);
        const titleInput = newEmbed.querySelector(`#embed-title-${embedId}`);
        const descriptionInput = newEmbed.querySelector(`#embed-description-${embedId}`);
        const imageUrlInput = newEmbed.querySelector(`#embed-image-url-${embedId}`);
        const footerInput = newEmbed.querySelector(`#embed-footer-${embedId}`);
        
        colorInput.addEventListener('input', updatePreview);
        titleInput.addEventListener('input', updatePreview);
        descriptionInput.addEventListener('input', updatePreview);
        imageUrlInput.addEventListener('input', updatePreview);
        footerInput.addEventListener('input', updatePreview);
        
        // Botão para adicionar campo
        const addFieldButton = newEmbed.querySelector('.secondary-button');
        addFieldButton.addEventListener('click', () => addFieldToEmbed(newEmbed));
        
        // Atualizar a prévia
        updatePreview();
    }

    // Adicionar campo a um embed
    function addFieldToEmbed(embedElement) {
        fieldCounter++;
        const fieldsContainer = embedElement.querySelector('.fields-container');
        
        const fieldTemplate = `
        <div class="field-group" data-field-id="${fieldCounter}">
            <div class="field-group-actions">
                <button class="icon-button" title="Remover campo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="input-group">
                <label>Nome do campo</label>
                <input type="text" placeholder="Nome do campo">
            </div>
            <div class="input-group">
                <label>Valor do campo</label>
                <textarea rows="2" placeholder="Valor do campo"></textarea>
            </div>
            <div class="inline-checkbox">
                <input type="checkbox" id="field-inline-${fieldCounter}">
                <label for="field-inline-${fieldCounter}">Campo inline</label>
            </div>
        </div>
        `;
        
        fieldsContainer.insertAdjacentHTML('beforeend', fieldTemplate);
        
        // Configurar event listeners para o novo campo
        const newField = fieldsContainer.lastElementChild;
        
        const removeButton = newField.querySelector('.field-group-actions button');
        const nameInput = newField.querySelector('input[type="text"]');
        const valueInput = newField.querySelector('textarea');
        const inlineCheckbox = newField.querySelector('input[type="checkbox"]');
        
        removeButton.addEventListener('click', () => removeField(newField));
        nameInput.addEventListener('input', updatePreview);
        valueInput.addEventListener('input', updatePreview);
        inlineCheckbox.addEventListener('change', updatePreview);
        
        // Atualizar a prévia
        updatePreview();
    }

    // Remover campo
    function removeField(fieldElement) {
        fieldElement.remove();
        updatePreview();
    }

    // Mover embed para cima ou para baixo
    function moveEmbed(embedElement, direction) {
        if (direction === 'up') {
            const prevElement = embedElement.previousElementSibling;
            if (prevElement) {
                embedList.insertBefore(embedElement, prevElement);
            }
        } else if (direction === 'down') {
            const nextElement = embedElement.nextElementSibling;
            if (nextElement) {
                embedList.insertBefore(nextElement, embedElement);
            }
        }
        updatePreview();
    }

    // Remover embed
    function removeEmbed(embedElement) {
        embedElement.remove();
        updatePreview();
    }

    // Atualizar prévia
    function updatePreview() {
        // Valores principais
        const username = usernameInput.value || 'Webhook Bot';
        const avatarUrl = avatarUrlInput.value;
        const content = contentInput.value || 'Esta é uma prévia da sua mensagem.';
        const messageImageUrl = messageImageUrlInput.value;
        
        // Criar a prévia da mensagem
        const previewHTML = `
        <div class="discord-message">
            <div class="message-header">
                <div class="avatar">${avatarUrl ? `<img src="${avatarUrl}" alt="Avatar">` : username.charAt(0)}</div>
                <div class="name">${username}</div>
                <div class="timestamp">Hoje às ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}</div>
            </div>
            <div class="message-content">${formatDiscordText(content)}</div>
            ${messageImageUrl ? `<img class="message-image" src="${messageImageUrl}" alt="Imagem da mensagem">` : ''}
            
            ${generateEmbedsPreview()}
        </div>
        `;
        
        discordPreview.innerHTML = previewHTML;
        
        // Atualizar preview de cores nos embeds
        document.querySelectorAll('.embed-item').forEach(embed => {
            const embedId = embed.dataset.embedId;
            const colorInput = document.getElementById(`embed-color-${embedId}`);
            const colorPreview = embed.querySelector('.color-preview');
            
            if (colorInput && colorPreview) {
                colorPreview.style.backgroundColor = colorInput.value;
            }
        });
    }

    // Formatar texto para o estilo do Discord
    function formatDiscordText(text) {
        if (!text) return '';
        
        // Substituir quebras de linha por <br>
        text = text.replace(/\n/g, '<br>');
        
        // Formatar texto em negrito (**texto**)
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Formatar texto em itálico (*texto*)
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Formatar código inline (`texto`)
        text = text.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Formatar menções (@usuario)
        text = text.replace(/@(\w+)/g, '<span style="color: #7289da; background-color: rgba(114, 137, 218, 0.1);">@$1</span>');
        
        return text;
    }

    // Gerar HTML para prévia dos embeds
    function generateEmbedsPreview() {
        let embedsHTML = '';
        
        document.querySelectorAll('.embed-item').forEach(embed => {
            const embedId = embed.dataset.embedId;
            const color = document.getElementById(`embed-color-${embedId}`).value;
            const title = document.getElementById(`embed-title-${embedId}`).value;
            const description = document.getElementById(`embed-description-${embedId}`).value;
            const imageUrl = document.getElementById(`embed-image-url-${embedId}`).value;
            const footer = document.getElementById(`embed-footer-${embedId}`).value;
            
            let fieldsHTML = '';
            const fieldsContainer = embed.querySelector('.fields-container');
            
            if (fieldsContainer) {
                fieldsContainer.querySelectorAll('.field-group').forEach(field => {
                    const fieldName = field.querySelector('input[type="text"]').value;
                    const fieldValue = field.querySelector('textarea').value;
                    const isInline = field.querySelector('input[type="checkbox"]').checked;
                    
                    if (fieldName || fieldValue) {
                        fieldsHTML += `
                        <div class="embed-field" style="${isInline ? 'display: inline-block; width: 45%; margin-right: 5%;' : ''}">
                            <div class="field-name">${fieldName}</div>
                            <div class="field-value">${formatDiscordText(fieldValue)}</div>
                        </div>
                        `;
                    }
                });
            }
            
            // Só adicionar o embed se tiver pelo menos um campo preenchido
            if (title || description || imageUrl || footer || fieldsHTML) {
                embedsHTML += `
                <div class="embed" style="border-left-color: ${color};">
                    ${title ? `<div class="embed-title">${formatDiscordText(title)}</div>` : ''}
                    ${description ? `<div class="embed-description">${formatDiscordText(description)}</div>` : ''}
                    ${imageUrl ? `<img class="embed-image" src="${imageUrl}" alt="Imagem do embed">` : ''}
                    ${fieldsHTML ? `<div class="embed-fields">${fieldsHTML}</div>` : ''}
                    ${footer ? `
                        <div class="embed-footer">
                            <div class="footer-icon"></div>
                            <div>${footer}</div>
                        </div>
                    ` : ''}
                </div>
                `;
            }
        });
        
        return embedsHTML;
    }

    // Enviar webhook para o Discord
    function sendWebhook() {
        const webhookUrl = webhookUrlInput.value.trim();
        
        if (!webhookUrl) {
            alert('Por favor, insira uma URL de webhook válida.');
            return;
        }
        
        const webhookData = collectWebhookData();
        
        // Enviar a solicitação
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
        })
        .then(response => {
            if (response.ok) {
                alert('Webhook enviado com sucesso!');
            } else {
                throw new Error(`Erro ao enviar webhook: ${response.status}`);
            }
        })
        .catch(error => {
            alert(`Falha ao enviar webhook: ${error.message}`);
            console.error('Erro ao enviar webhook:', error);
        });
    }

    // Salvar configuração do webhook
    function saveWebhookConfig() {
        const webhookData = collectWebhookData();
        const webhookConfig = {
            webhookUrl: webhookUrlInput.value,
            data: webhookData
        };
        
        // Converter para JSON e salvá-lo
        const jsonData = JSON.stringify(webhookConfig);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Criar um link para download e clicar nele
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'webhook-config.json';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Liberar a URL
        URL.revokeObjectURL(url);
    }

    // Coletar todos os dados do formulário
    function collectWebhookData() {
        // Dados básicos
        const webhookData = {
            username: usernameInput.value || undefined,
            avatar_url: avatarUrlInput.value || undefined,
            content: contentInput.value || undefined,
        };
        
        // Embeds
        const embeds = [];
		
		// Se houver uma URL de imagem da mensagem, criar um embed para ela
    if (messageImageUrlInput.value) {
        embeds.push({
            image: {
                url: messageImageUrlInput.value
            }
        });
    }
        
        document.querySelectorAll('.embed-item').forEach(embed => {
            const embedId = embed.dataset.embedId;
            const color = document.getElementById(`embed-color-${embedId}`).value;
            const title = document.getElementById(`embed-title-${embedId}`).value;
            const description = document.getElementById(`embed-description-${embedId}`).value;
            const imageUrl = document.getElementById(`embed-image-url-${embedId}`).value;
            const footer = document.getElementById(`embed-footer-${embedId}`).value;
            
            // Converter cor hex para decimal (formato que o Discord usa)
            const colorDec = parseInt(color.replace('#', ''), 16);
            
            const embedData = {
                color: colorDec,
            };
            
            if (title) embedData.title = title;
            if (description) embedData.description = description;
            if (imageUrl) embedData.image = { url: imageUrl };
            if (footer) embedData.footer = { text: footer };
            
            // Campos
            const fields = [];
            const fieldsContainer = embed.querySelector('.fields-container');
            
            if (fieldsContainer) {
                fieldsContainer.querySelectorAll('.field-group').forEach(field => {
                    const fieldName = field.querySelector('input[type="text"]').value;
                    const fieldValue = field.querySelector('textarea').value;
                    const isInline = field.querySelector('input[type="checkbox"]').checked;
                    
                    if (fieldName || fieldValue) {
                        fields.push({
                            name: fieldName || '\u200b', // Caractere invisível se o nome estiver vazio
                            value: fieldValue || '\u200b', // Caractere invisível se o valor estiver vazio
                            inline: isInline
                        });
                    }
                });
            }
            
            if (fields.length > 0) {
                embedData.fields = fields;
            }
            
            // Só adicionar o embed se tiver pelo menos um campo preenchido
            if (title || description || imageUrl || footer || fields.length > 0) {
                embeds.push(embedData);
            }
        });
        
        if (embeds.length > 0) {
            webhookData.embeds = embeds;
        }
        
        return webhookData;
    }

    // Limpar o formulário
    function clearForm() {
        if (confirm('Tem certeza que deseja limpar todos os campos?')) {
            webhookUrlInput.value = '';
            usernameInput.value = '';
            avatarUrlInput.value = '';
            contentInput.value = '';
            messageImageUrlInput.value = '';
            
            // Manter apenas o primeiro embed e limpar todos os seus campos
            const firstEmbed = document.querySelector('.embed-item');
            if (firstEmbed) {
                const embedId = firstEmbed.dataset.embedId;
                
                document.getElementById(`embed-color-${embedId}`).value = '#ff3232';
                document.getElementById(`embed-title-${embedId}`).value = '';
                document.getElementById(`embed-description-${embedId}`).value = '';
                document.getElementById(`embed-image-url-${embedId}`).value = '';
                document.getElementById(`embed-footer-${embedId}`).value = '';
                
                // Remover todos os campos
                const fieldsContainer = firstEmbed.querySelector('.fields-container');
                fieldsContainer.innerHTML = '';
                
                // Remover todos os outros embeds
                const embeds = document.querySelectorAll('.embed-item');
                for (let i = 1; i < embeds.length; i++) {
                    embeds[i].remove();
                }
            }
            
            // Atualizar a prévia
            updatePreview();
        }
    }

    // Função para carregar configuração de webhook de arquivo
    function loadWebhookConfig(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const config = JSON.parse(e.target.result);
                
                // Preencher dados básicos
                if (config.webhookUrl) webhookUrlInput.value = config.webhookUrl;
                if (config.data.username) usernameInput.value = config.data.username;
                if (config.data.avatar_url) avatarUrlInput.value = config.data.avatar_url;
                if (config.data.content) contentInput.value = config.data.content;
                
                // Limpar embeds existentes
                embedList.innerHTML = '';
                embedCounter = 0;
                
                // Adicionar embeds do arquivo
                if (config.data.embeds && config.data.embeds.length > 0) {
                    config.data.embeds.forEach(embedData => {
                        addNewEmbed();
                        const newEmbed = embedList.lastElementChild;
                        const embedId = newEmbed.dataset.embedId;
                        
                        // Converter cor decimal para hex
                        if (embedData.color !== undefined) {
                            const colorHex = '#' + embedData.color.toString(16).padStart(6, '0');
                            document.getElementById(`embed-color-${embedId}`).value = colorHex;
                        }
                        
                        if (embedData.title) document.getElementById(`embed-title-${embedId}`).value = embedData.title;
                        if (embedData.description) document.getElementById(`embed-description-${embedId}`).value = embedData.description;
                        if (embedData.image && embedData.image.url) document.getElementById(`embed-image-url-${embedId}`).value = embedData.image.url;
                        if (embedData.footer && embedData.footer.text) document.getElementById(`embed-footer-${embedId}`).value = embedData.footer.text;
                        
                        // Adicionar campos
                        if (embedData.fields && embedData.fields.length > 0) {
                            embedData.fields.forEach(fieldData => {
                                addFieldToEmbed(newEmbed);
                                const fieldsContainer = newEmbed.querySelector('.fields-container');
                                const newField = fieldsContainer.lastElementChild;
                                
                                // Preencher dados do campo
                                if (fieldData.name && fieldData.name !== '\u200b') newField.querySelector('input[type="text"]').value = fieldData.name;
                                if (fieldData.value && fieldData.value !== '\u200b') newField.querySelector('textarea').value = fieldData.value;
                                if (fieldData.inline) newField.querySelector('input[type="checkbox"]').checked = fieldData.inline;
                            });
                        }
                    });
                }
                
                // Atualizar a prévia
                updatePreview();
                
                alert('Configuração de webhook carregada com sucesso!');
            } catch (error) {
                alert('Erro ao carregar o arquivo: formato inválido.');
                console.error('Erro ao carregar configuração:', error);
            }
        };
        reader.readAsText(file);
    }

    // Adicionar botão para carregar configuração
    const loadConfigButton = document.createElement('button');
    loadConfigButton.className = 'secondary-button';
    loadConfigButton.textContent = 'Carregar Configuração';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', loadWebhookConfig);
    
    loadConfigButton.addEventListener('click', () => fileInput.click());
    
    document.querySelector('.button-group').appendChild(loadConfigButton);
    document.body.appendChild(fileInput);
});