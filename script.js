
// Constantes
const questions = [
    "Minha fala e meu tom de voz são dóceis, respeitosos e edificantes?",
    "Busco vestir-me com modéstia, elegância e dignidade, sem expor meu corpo de forma indevida?",
    "Minha presença em casa ou no trabalho transmite paz e harmonia às pessoas ao meu redor?",
    "Como mãe (ou referência para crianças), educo com paciência e amor, sem irritação ou impaciência?",
    "Como esposa (ou solteira que deseja o matrimônio), demonstro respeito e apoio ao meu marido (ou me preparo para isso)?",
    "Como solteira, guardo minha pureza e dignidade, evitando relacionamentos que não agradam a Deus?",
    "Recorro a Nossa Senhora em minhas dificuldades e alegrias, confiando nela como mãe espiritual?",
    "Cuido do meu corpo como templo do Espírito Santo, alimentando-me bem e evitando excessos?",
    "Evito conversas fúteis, fofocas e palavras que podem ferir os outros?",
    "Faço do lar um ambiente acolhedor e harmonioso para minha família e amigos?",
    "Me esforço para ser humilde, evitando orgulho e vaidade excessiva?",
    "Busco imitar a obediência e submissão de Maria à vontade de Deus em minha vida?",
    "Meu comportamento e gestos refletem feminilidade e delicadeza, sem vulgaridade ou grosseria?",
    "Pratico a castidade no meu estado de vida, seja como solteira, esposa ou consagrada?",
    "Reservo tempo para oração e intimidade com Deus diariamente?",
    "Demonstro gratidão a Deus e às pessoas ao meu redor em todas as situações?",
    "Escolho bem o que assisto, leio e escuto, evitando conteúdos que possam manchar minha alma?",
    "Perdoo com facilidade e não guardo rancor?",
    "Procuro ajudar os outros sem esperar algo em troca?",
    "Vivo com alegria e serenidade, confiando na providência divina?",
    "Demonstro paciência e domínio próprio quando estou irritada ou cansada?",
    "Me esforço para manter minha casa ou quarto limpos e organizados, promovendo um ambiente agradável?",
    "Sou atenta às necessidades dos outros e procuro servi-los com amor?",
    "Cuido da minha saúde e higiene sem cair em exageros de vaidade?",
    "Tenho um coração dócil e aberto à correção para me tornar uma mulher melhor?"
];

const options = [
    { label: "Sempre", value: "A", points: 5 },
    { label: "Frequentemente", value: "B", points: 4 },
    { label: "Às vezes", value: "C", points: 3 },
    { label: "Raramente", value: "D", points: 2 },
    { label: "Nunca", value: "E", points: 1 }
];

// Estado da aplicação
let currentStep = 0;
let answers = {};
let userName = localStorage.getItem("userName") || "";
let userEmail = localStorage.getItem("userEmail") || "";

// Elementos do DOM
const form = document.getElementById("questionForm");
const progressBar = document.getElementById("progressBar");
const initialStep = document.getElementById("initialStep");
const questionTemplate = document.getElementById("questionTemplate");
const resultsStep = document.getElementById("resultsStep");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    // Carregar dados salvos
    answers = JSON.parse(localStorage.getItem("userAnswers") || "{}");
    nameInput.value = userName;
    emailInput.value = userEmail;
    updateProgress();
    
    // Eventos
    backBtn.addEventListener("click", handleBack);
    nextBtn.addEventListener("click", handleNext);
    document.getElementById("sendEmailBtn").addEventListener("click", handleSendEmail);
    document.getElementById("resetBtn").addEventListener("click", handleReset);
});

// Funções auxiliares
function updateProgress() {
    const progress = (currentStep / (questions.length + 1)) * 100;
    progressBar.style.width = `${progress}%`;
}

function showToast(title, message, isError = false) {
    alert(`${title}\n${message}`);
}

function showStep(step) {
    initialStep.style.display = "none";
    questionTemplate.style.display = "none";
    resultsStep.style.display = "none";
    backBtn.style.display = step === 0 ? "none" : "block";

    if (step === 0) {
        initialStep.style.display = "block";
    } else if (step <= questions.length) {
        questionTemplate.style.display = "block";
        displayQuestion(step - 1);
    } else {
        resultsStep.style.display = "block";
        showResults();
    }

    updateProgress();
}

function displayQuestion(index) {
    const question = questions[index];
    questionTemplate.querySelector(".question-text").textContent = `${index + 1}. ${question}`;
    
    // Limpar seleção anterior
    const radios = questionTemplate.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.checked = false);
    
    // Selecionar resposta salva se existir
    if (answers[index]) {
        const savedRadio = questionTemplate.querySelector(`input[value="${answers[index]}"]`);
        if (savedRadio) savedRadio.checked = true;
    }
}

function handleNext() {
    if (currentStep === 0) {
        userName = nameInput.value;
        userEmail = emailInput.value;
        
        if (!userName || !userEmail) {
            showToast("Campos obrigatórios", "Por favor, preencha seu nome e email para continuar.", true);
            return;
        }

        localStorage.setItem("userName", userName);
        localStorage.setItem("userEmail", userEmail);
    } else if (currentStep <= questions.length) {
        const selectedAnswer = questionTemplate.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) {
            showToast("Resposta necessária", "Por favor, selecione uma resposta para continuar.", true);
            return;
        }
        
        answers[currentStep - 1] = selectedAnswer.value;
        localStorage.setItem("userAnswers", JSON.stringify(answers));
    }

    currentStep++;
    showStep(currentStep);
}

function handleBack() {
    if (currentStep > 0) {
        currentStep--;
        if (currentStep > 0) {
            delete answers[currentStep - 1];
            localStorage.setItem("userAnswers", JSON.stringify(answers));
        }
        showStep(currentStep);
    }
}

function getTotalScore() {
    return Object.values(answers).reduce((total, answer) => {
        const option = options.find(opt => opt.value === answer);
        return total + (option?.points || 0);
    }, 0);
}

function getResultMessage(score) {
    if (score >= 110) {
        return {
            title: "Virtuosa como Maria",
            message: "Você reflete as virtudes de Nossa Senhora e busca viver como uma mulher de Deus. Continue firme e fortaleça ainda mais sua espiritualidade."
        };
    } else if (score >= 85) {
        return {
            title: "No caminho da santidade",
            message: "Você já tem muitas virtudes, mas há áreas em que pode crescer. Continue buscando a imitação de Maria e aperfeiçoando sua feminilidade."
        };
    } else if (score >= 60) {
        return {
            title: "Mulher em construção",
            message: "Você deseja ser virtuosa, mas ainda tem desafios a superar. Com esforço, oração e pequenas mudanças, pode crescer muito!"
        };
    } else {
        return {
            title: "Hora de um recomeço",
            message: "Talvez você precise rever sua vida e buscar mais inspiração em Nossa Senhora. Mas nunca é tarde para se transformar e ser uma mulher mais virtuosa!"
        };
    }
}

function showResults() {
    const score = getTotalScore();
    const result = getResultMessage(score);
    
    document.getElementById("resultTitle").textContent = result.title;
    document.getElementById("resultMessage").textContent = result.message;
    document.getElementById("scoreText").textContent = `Sua pontuação: ${score} pontos`;
}

function formatAnswersForEmail(score, result) {
    let emailContent = `Nome: ${userName}\n\n`;
    emailContent += `Resultado: ${result.title}\n`;
    emailContent += `Pontuação: ${score} pontos\n\n`;
    emailContent += "Respostas:\n\n";

    questions.forEach((question, index) => {
        const answer = answers[index];
        const option = options.find(opt => opt.value === answer);
        emailContent += `${index + 1}. ${question}\nResposta: ${option?.label || 'Não respondida'}\n\n`;
    });

    return emailContent;
}

function handleSendEmail() {
    const score = getTotalScore();
    const result = getResultMessage(score);
    const emailContent = formatAnswersForEmail(score, result);
    const emailSubject = "Resultados da Avaliação de Virtudes Espirituais";
    const mailtoLink = `mailto:${userEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailContent)}`;
    window.location.href = mailtoLink;
}

function handleReset() {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userAnswers");
    currentStep = 0;
    answers = {};
    userName = "";
    userEmail = "";
    nameInput.value = "";
    emailInput.value = "";
    showStep(0);
}

// Iniciar mostrando o primeiro passo
showStep(0);
