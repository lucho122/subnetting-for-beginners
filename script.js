document.addEventListener('DOMContentLoaded', () => {
    const validateBtn = document.getElementById('validate-btn');
    const feedbackContainer = document.getElementById('feedback');
    const exampleContainer = document.getElementById('example-solution');
    const explanationContainer = document.getElementById('explanation');
    const scenarioSelect = document.getElementById('scenario-select');
    const scenarioDescription = document.getElementById('scenario-description');
    const requirementsContainer = document.getElementById('requirements-container');
    const solutionContainer = document.getElementById('solution-container');

    // Definir escenarios
    const scenarios = {
        custom: {
            title: "Escenario Personalizado",
            description: "Define tus propios requisitos de red y propón una solución.",
            requirements: [
                { type: "number", id: "required-hosts", label: "Número de hosts necesarios", placeholder: "Ej: 50" }
            ],
            solution: [
                { type: "text", id: "proposed-mask", label: "Máscara de subred propuesta", placeholder: "Ej: 255.255.255.192" },
                { type: "text", id: "proposed-network", label: "Dirección de red propuesta", placeholder: "Ej: 192.168.1.0" },
                { type: "text", id: "proposed-broadcast", label: "Dirección de broadcast propuesta", placeholder: "Ej: 192.168.1.63" }
            ]
        },
        "small-network": {
            title: "Red Pequeña",
            description: "Diseña una subred para una pequeña oficina con menos de 50 hosts.",
            requirements: [
                { type: "number", id: "required-hosts", label: "Número de hosts necesarios", placeholder: "Ej: 30" }
            ],
            solution: [
                { type: "text", id: "proposed-mask", label: "Máscara de subred propuesta", placeholder: "Ej: 255.255.255.192" },
                { type: "text", id: "proposed-network", label: "Dirección de red propuesta", placeholder: "Ej: 192.168.1.0" },
                { type: "text", id: "proposed-broadcast", label: "Dirección de broadcast propuesta", placeholder: "Ej: 192.168.1.63" }
            ]
        },
        "medium-network": {
            title: "Red Mediana",
            description: "Diseña una subred para una empresa mediana con entre 50 y 200 hosts.",
            requirements: [
                { type: "number", id: "required-hosts", label: "Número de hosts necesarios", placeholder: "Ej: 100" }
            ],
            solution: [
                { type: "text", id: "proposed-mask", label: "Máscara de subred propuesta", placeholder: "Ej: 255.255.255.128" },
                { type: "text", id: "proposed-network", label: "Dirección de red propuesta", placeholder: "Ej: 192.168.1.0" },
                { type: "text", id: "proposed-broadcast", label: "Dirección de broadcast propuesta", placeholder: "Ej: 192.168.1.127" }
            ]
        },
        "large-network": {
            title: "Red Grande",
            description: "Diseña una subred para una empresa grande con más de 200 hosts.",
            requirements: [
                { type: "number", id: "required-hosts", label: "Número de hosts necesarios", placeholder: "Ej: 300" }
            ],
            solution: [
                { type: "text", id: "proposed-mask", label: "Máscara de subred propuesta", placeholder: "Ej: 255.255.254.0" },
                { type: "text", id: "proposed-network", label: "Dirección de red propuesta", placeholder: "Ej: 192.168.0.0" },
                { type: "text", id: "proposed-broadcast", label: "Dirección de broadcast propuesta", placeholder: "Ej: 192.168.1.255" }
            ]
        },
        "multiple-subnets": {
            title: "Múltiples Subredes",
            description: "Diseña múltiples subredes para diferentes departamentos de una empresa.",
            requirements: [
                { type: "number", id: "admin-hosts", label: "Hosts para Administración", placeholder: "Ej: 30" },
                { type: "number", id: "sales-hosts", label: "Hosts para Ventas", placeholder: "Ej: 50" },
                { type: "number", id: "it-hosts", label: "Hosts para IT", placeholder: "Ej: 20" }
            ],
            solution: [
                { type: "text", id: "base-network", label: "Red base", placeholder: "Ej: 192.168.0.0" },
                { type: "text", id: "admin-mask", label: "Máscara para Administración", placeholder: "Ej: 255.255.255.192" },
                { type: "text", id: "sales-mask", label: "Máscara para Ventas", placeholder: "Ej: 255.255.255.192" },
                { type: "text", id: "it-mask", label: "Máscara para IT", placeholder: "Ej: 255.255.255.224" }
            ]
        },
        "vlsm": {
            title: "VLSM (Variable Length Subnet Masking)",
            description: "Practica el diseño de subredes con máscaras de longitud variable para optimizar el uso de direcciones IP.",
            requirements: [
                { type: "number", id: "lan1-hosts", label: "Hosts para LAN 1", placeholder: "Ej: 100" },
                { type: "number", id: "lan2-hosts", label: "Hosts para LAN 2", placeholder: "Ej: 50" },
                { type: "number", id: "lan3-hosts", label: "Hosts para LAN 3", placeholder: "Ej: 25" }
            ],
            solution: [
                { type: "text", id: "base-network", label: "Red base", placeholder: "Ej: 192.168.0.0" },
                { type: "text", id: "lan1-mask", label: "Máscara para LAN 1", placeholder: "Ej: 255.255.255.128" },
                { type: "text", id: "lan2-mask", label: "Máscara para LAN 2", placeholder: "Ej: 255.255.255.192" },
                { type: "text", id: "lan3-mask", label: "Máscara para LAN 3", placeholder: "Ej: 255.255.255.224" }
            ]
        }
    };

    // Event listeners
    validateBtn.addEventListener('click', validateSolution);
    scenarioSelect.addEventListener('change', updateScenario);

    // Inicializar con el escenario por defecto
    updateScenario();

    function updateScenario() {
        const selectedScenario = scenarios[scenarioSelect.value];
        
        // Actualizar descripción
        scenarioDescription.innerHTML = `
            <h4>${selectedScenario.title}</h4>
            <p>${selectedScenario.description}</p>
        `;

        // Generar campos de requisitos
        requirementsContainer.innerHTML = selectedScenario.requirements.map(req => `
            <div class="input-group">
                <label for="${req.id}">${req.label}:</label>
                <input type="${req.type}" id="${req.id}" min="1" placeholder="${req.placeholder}">
            </div>
        `).join('');

        // Generar campos de solución
        solutionContainer.innerHTML = selectedScenario.solution.map(sol => `
            <div class="input-group">
                <label for="${sol.id}">${sol.label}:</label>
                <input type="${sol.type}" id="${sol.id}" placeholder="${sol.placeholder}">
            </div>
        `).join('');
    }

    function validateSolution() {
        const scenario = scenarios[scenarioSelect.value];
        const values = {};

        // Recopilar valores de los campos
        scenario.requirements.forEach(req => {
            values[req.id] = document.getElementById(req.id).value;
        });
        scenario.solution.forEach(sol => {
            values[sol.id] = document.getElementById(sol.id).value;
        });

        // Validar según el escenario
        const validation = validateScenario(scenarioSelect.value, values);
        showFeedback(validation);
    }

    function validateScenario(scenarioType, values) {
        const validation = {
            isCorrect: true,
            errors: []
        };

        switch(scenarioType) {
            case 'custom':
            case 'small-network':
            case 'medium-network':
            case 'large-network':
                return validateSingleSubnet(values);
            case 'multiple-subnets':
                return validateMultipleSubnets(values);
            case 'vlsm':
                return validateVLSM(values);
            default:
                validation.isCorrect = false;
                validation.errors.push('Escenario no válido');
                return validation;
        }
    }

    function validateSingleSubnet(values) {
        const validation = {
            isCorrect: true,
            errors: []
        };

        const requiredHosts = parseInt(values['required-hosts']);
        const proposedMask = values['proposed-mask'];
        const proposedNetwork = values['proposed-network'];
        const proposedBroadcast = values['proposed-broadcast'];

        if (!validateInputs(requiredHosts, proposedMask, proposedNetwork, proposedBroadcast)) {
            validation.isCorrect = false;
            validation.errors.push('Por favor, completa todos los campos correctamente');
            return validation;
        }

        const correctSolution = calculateCorrectSolution(requiredHosts, proposedNetwork);
        
        if (proposedMask !== correctSolution.mask) {
            validation.isCorrect = false;
            validation.errors.push(`La máscara de subred propuesta (${proposedMask}) no es correcta. 
                Para ${requiredHosts} hosts, necesitas una máscara que permita al menos ${requiredHosts + 2} direcciones.`);
        }

        if (proposedBroadcast !== correctSolution.broadcast) {
            validation.isCorrect = false;
            validation.errors.push(`La dirección de broadcast propuesta (${proposedBroadcast}) no es correcta.`);
        }

        const networkOctets = proposedNetwork.split('.').map(Number);
        const maskOctets = proposedMask.split('.').map(Number);
        const calculatedNetwork = networkOctets.map((octet, i) => octet & maskOctets[i]).join('.');
        
        if (calculatedNetwork !== proposedNetwork) {
            validation.isCorrect = false;
            validation.errors.push(`La dirección de red propuesta (${proposedNetwork}) no es una dirección de red válida.`);
        }

        return validation;
    }

    function validateMultipleSubnets(values) {
        const validation = {
            isCorrect: true,
            errors: []
        };

        // Implementar validación para múltiples subredes
        // TODO: Implementar lógica de validación para múltiples subredes

        return validation;
    }

    function validateVLSM(values) {
        const validation = {
            isCorrect: true,
            errors: []
        };

        // Implementar validación para VLSM
        // TODO: Implementar lógica de validación para VLSM

        return validation;
    }

    function validateInputs(hosts, mask, network, broadcast) {
        if (!hosts || hosts < 1) {
            showError('Por favor, ingresa un número válido de hosts requeridos');
            return false;
        }

        if (!validateIP(mask) || !validateIP(network) || !validateIP(broadcast)) {
            showError('Por favor, ingresa direcciones IP válidas');
            return false;
        }

        return true;
    }

    function validateIP(ip) {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(ip)) return false;
        
        const octets = ip.split('.');
        return octets.every(octet => {
            const num = parseInt(octet);
            return num >= 0 && num <= 255;
        });
    }

    function calculateCorrectSolution(requiredHosts, networkIP) {
        // Calcular bits necesarios para hosts
        const hostBits = Math.ceil(Math.log2(requiredHosts + 2)); // +2 para red y broadcast
        const networkBits = 32 - hostBits;
        
        // Calcular máscara
        const maskOctets = [];
        let remainingBits = networkBits;
        for (let i = 0; i < 4; i++) {
            if (remainingBits >= 8) {
                maskOctets.push(255);
                remainingBits -= 8;
            } else {
                maskOctets.push(256 - Math.pow(2, 8 - remainingBits));
                remainingBits = 0;
            }
        }

        const mask = maskOctets.join('.');
        const networkOctets = networkIP.split('.').map(Number);
        const broadcastOctets = calculateBroadcast(networkOctets, maskOctets);

        return {
            mask,
            network: networkIP,
            broadcast: broadcastOctets.join('.'),
            availableHosts: Math.pow(2, hostBits) - 2
        };
    }

    function calculateBroadcast(networkOctets, maskOctets) {
        return networkOctets.map((octet, i) => octet | (~maskOctets[i] & 255));
    }

    function showFeedback(validation) {
        feedbackContainer.style.display = 'block';
        feedbackContainer.className = 'feedback-container ' + (validation.isCorrect ? 'success' : 'error');

        if (validation.isCorrect) {
            feedbackContainer.innerHTML = `
                <h3>¡Correcto! 🎉</h3>
                <p>Tu solución es correcta. Has calculado correctamente la subred para ${document.getElementById('required-hosts').value} hosts.</p>
            `;
            exampleContainer.style.display = 'none';
        } else {
            feedbackContainer.innerHTML = `
                <h3>Hay algunos errores en tu solución</h3>
                <ul>
                    ${validation.errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
                <p>¿Te gustaría ver la solución correcta?</p>
                <button onclick="showCorrectSolution()">Ver Solución Correcta</button>
            `;
        }
    }

    function showCorrectSolution() {
        const requiredHosts = parseInt(document.getElementById('required-hosts').value);
        const proposedNetwork = document.getElementById('proposed-network').value;
        const correctSolution = calculateCorrectSolution(requiredHosts, proposedNetwork);

        // Calcular primera y última dirección de host
        const networkOctets = correctSolution.network.split('.').map(Number);
        const broadcastOctets = correctSolution.broadcast.split('.').map(Number);
        
        // Primera dirección de host (red + 1)
        const firstHost = `${networkOctets[0]}.${networkOctets[1]}.${networkOctets[2]}.${networkOctets[3] + 1}`;
        
        // Última dirección de host (broadcast - 1)
        const lastHost = `${broadcastOctets[0]}.${broadcastOctets[1]}.${broadcastOctets[2]}.${broadcastOctets[3] - 1}`;

        exampleContainer.style.display = 'block';
        exampleContainer.querySelector('.solution-details').innerHTML = `
            <p><strong>Máscara de subred correcta:</strong> ${correctSolution.mask}</p>
            <p><strong>Dirección de red:</strong> ${correctSolution.network}</p>
            <p><strong>Primera dirección de host:</strong> ${firstHost}</p>
            <p><strong>Última dirección de host:</strong> ${lastHost}</p>
            <p><strong>Dirección de broadcast:</strong> ${correctSolution.broadcast}</p>
            <p><strong>Hosts disponibles:</strong> ${correctSolution.availableHosts}</p>
        `;
    }

    function toggleExplanation() {
        const isVisible = explanationContainer.style.display === 'block';
        explanationContainer.style.display = isVisible ? 'none' : 'block';
        const button = document.getElementById('show-explanation-btn');
        if (button) {
            button.textContent = isVisible ? 'Ver Explicación' : 'Ocultar Explicación';
        }
    }

    function showError(message) {
        feedbackContainer.style.display = 'block';
        feedbackContainer.className = 'feedback-container error';
        feedbackContainer.innerHTML = `<p>${message}</p>`;
    }

    // Hacer las funciones accesibles globalmente
    window.showCorrectSolution = showCorrectSolution;
    window.toggleExplanation = toggleExplanation;

    // Simulator functionality
    const generateBtn = document.getElementById('generate-btn');
    const numSubnetsInput = document.getElementById('num-subnets');
    const maxHostsInput = document.getElementById('max-hosts');
    const hostDistributionSelect = document.getElementById('host-distribution');
    const uniformHostsDiv = document.getElementById('uniform-hosts');
    const variableHostsDiv = document.getElementById('variable-hosts');
    const hostInputsDiv = document.getElementById('host-inputs');
    const simulatorResult = document.getElementById('simulator-result');
    const networkDetails = document.getElementById('network-details');
    const subnetsTable = document.getElementById('subnets-table').getElementsByTagName('tbody')[0];
    const baseNetworkInput = document.getElementById('base-network');
    const basePrefixSelect = document.getElementById('base-prefix');

    generateBtn.addEventListener('click', generateExercise);
    numSubnetsInput.addEventListener('change', updateHostInputs);
    hostDistributionSelect.addEventListener('change', toggleHostDistribution);

    function toggleHostDistribution() {
        if (hostDistributionSelect.value === 'uniform') {
            uniformHostsDiv.style.display = 'block';
            variableHostsDiv.style.display = 'none';
        } else {
            uniformHostsDiv.style.display = 'none';
            variableHostsDiv.style.display = 'block';
            updateHostInputs();
        }
    }

    function updateHostInputs() {
        const numSubnets = parseInt(numSubnetsInput.value);
        hostInputsDiv.innerHTML = '';
        
        for (let i = 0; i < numSubnets; i++) {
            const inputRow = document.createElement('div');
            inputRow.className = 'host-input-row';
            inputRow.innerHTML = `
                <label>Subred ${i + 1}:</label>
                <input type="number" class="host-count" min="2" max="254" value="50">
            `;
            hostInputsDiv.appendChild(inputRow);
        }
    }

    function getHostRequirements() {
        if (hostDistributionSelect.value === 'uniform') {
            const maxHosts = parseInt(maxHostsInput.value);
            return Array(parseInt(numSubnetsInput.value)).fill(maxHosts);
        } else {
            return Array.from(document.getElementsByClassName('host-count'))
                .map(input => parseInt(input.value));
        }
    }

    function generateExercise() {
        const numSubnets = parseInt(numSubnetsInput.value);
        const hostRequirements = getHostRequirements();
        const baseNetwork = baseNetworkInput.value.trim();
        const basePrefix = parseInt(basePrefixSelect.value);

        // Validar dirección base
        if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(baseNetwork)) {
            alert('La dirección de red base no es válida. Ejemplo: 192.168.0.0');
            return;
        }
        const baseOctets = baseNetwork.split('.').map(Number);
        if (baseOctets.some(oct => oct < 0 || oct > 255)) {
            alert('La dirección de red base no es válida. Ejemplo: 192.168.0.0');
            return;
        }

        // Calcular espacio total disponible
        const totalAvailable = Math.pow(2, 32 - basePrefix);

        // Calcular tamaño necesario para cada subred (ordenar de mayor a menor)
        const subnetsInfo = hostRequirements.map((hosts, i) => ({
            hosts,
            index: i,
            bits: Math.ceil(Math.log2(hosts + 2)),
            size: Math.pow(2, Math.ceil(Math.log2(hosts + 2)))
        })).sort((a, b) => b.size - a.size);

        const totalNeeded = subnetsInfo.reduce((acc, s) => acc + s.size, 0);
        if (totalNeeded > totalAvailable) {
            alert('La combinación de subredes y hosts excede el espacio disponible en la red base seleccionada. Por favor, elige una red base más grande o reduce los valores.');
            return;
        }

        // Asignar rangos de subred
        let currentAddress = (baseOctets[0] << 24) | (baseOctets[1] << 16) | (baseOctets[2] << 8) | baseOctets[3];
        const subnets = [];
        for (const subnet of subnetsInfo) {
            const maskBits = 32 - Math.ceil(Math.log2(subnet.hosts + 2));
            const maskOctets = calculateMaskOctets(maskBits);
            const networkAddress = [
                (currentAddress >> 24) & 0xFF,
                (currentAddress >> 16) & 0xFF,
                (currentAddress >> 8) & 0xFF,
                currentAddress & 0xFF
            ];
            const broadcastAddressInt = currentAddress + subnet.size - 1;
            const broadcastAddress = [
                (broadcastAddressInt >> 24) & 0xFF,
                (broadcastAddressInt >> 16) & 0xFF,
                (broadcastAddressInt >> 8) & 0xFF,
                broadcastAddressInt & 0xFF
            ];
            const firstHost = [
                (currentAddress >> 24) & 0xFF,
                (currentAddress >> 16) & 0xFF,
                (currentAddress >> 8) & 0xFF,
                (currentAddress & 0xFF) + 1
            ];
            const lastHost = [
                (broadcastAddressInt >> 24) & 0xFF,
                (broadcastAddressInt >> 16) & 0xFF,
                (broadcastAddressInt >> 8) & 0xFF,
                (broadcastAddressInt & 0xFF) - 1
            ];
            subnets.push({
                network: networkAddress.join('.'),
                firstHost: subnet.size > 2 ? firstHost.join('.') : '-',
                lastHost: subnet.size > 2 ? lastHost.join('.') : '-',
                broadcast: broadcastAddress.join('.'),
                mask: maskOctets.join('.'),
                prefix: maskBits,
                requiredHosts: subnet.hosts,
                originalIndex: subnet.index
            });
            currentAddress += subnet.size;
        }
        // Reordenar a como el usuario los ingresó
        subnets.sort((a, b) => a.originalIndex - b.originalIndex);
        displayResults(baseNetwork + '/' + basePrefix, subnets);
    }

    function calculateMaskOctets(maskBits) {
        const maskOctets = [0, 0, 0, 0];
        let remainingBits = maskBits;
        
        for (let i = 0; i < 4; i++) {
            if (remainingBits >= 8) {
                maskOctets[i] = 255;
                remainingBits -= 8;
            } else if (remainingBits > 0) {
                maskOctets[i] = 256 - Math.pow(2, 8 - remainingBits);
                remainingBits = 0;
            }
        }
        
        return maskOctets;
    }

    function displayResults(baseNetwork, subnets) {
        // Mostrar información de red base
        networkDetails.innerHTML = `
            <p><strong>Red base:</strong> ${baseNetwork}</p>
            <p><strong>Número de Subredes:</strong> ${subnets.length}</p>
        `;
        // Limpiar y poblar tabla
        subnetsTable.innerHTML = '';
        subnets.forEach((subnet, index) => {
            const row = subnetsTable.insertRow();
            row.innerHTML = `
                <td>Subred ${index + 1}</td>
                <td>${subnet.network}/${subnet.prefix}</td>
                <td>${subnet.firstHost}</td>
                <td>${subnet.lastHost}</td>
                <td>${subnet.broadcast}</td>
                <td>${subnet.mask}</td>
                <td>${subnet.requiredHosts}</td>
            `;
        });
        simulatorResult.classList.add('active');
    }
}); 