
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useToast } from "./ui/use-toast";

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

const getResultMessage = (score: number) => {
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
};

export function Questions() {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep === 0 && (!name || !email)) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e email para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep > 0 && !answers[currentStep - 1]) {
      toast({
        title: "Resposta necessária",
        description: "Por favor, selecione uma resposta para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === questions.length) {
      calculateResults();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    // Remove a resposta da questão atual antes de voltar
    const newAnswers = { ...answers };
    delete newAnswers[currentStep - 1];
    setAnswers(newAnswers);
    setCurrentStep((prev) => prev - 1);
  };

  const calculateResults = () => {
    setShowResults(true);
  };

  const getTotalScore = () => {
    return Object.values(answers).reduce((total, answer) => {
      const option = options.find((opt) => opt.value === answer);
      return total + (option?.points || 0);
    }, 0);
  };

  const progress = (currentStep / (questions.length + 1)) * 100;

  if (showResults) {
    const score = getTotalScore();
    const result = getResultMessage(score);

    return (
      <div className="question-form">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-semibold text-primary">{result.title}</h1>
          <p className="text-xl text-gray-600">{result.message}</p>
          <div className="p-6 bg-secondary rounded-lg">
            <p className="text-2xl font-medium">Sua pontuação: {score} pontos</p>
          </div>
          <Button
            onClick={() => {
              setCurrentStep(0);
              setAnswers({});
              setShowResults(false);
            }}
            className="mt-4"
          >
            Começar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="question-form">
      <div className="progress-bar mb-8">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {currentStep === 0 ? (
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl font-semibold text-center text-primary mb-8">
            Avaliação de Virtudes Espirituais
          </h1>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-medium">
            {currentStep}. {questions[currentStep - 1]}
          </h2>
          <RadioGroup
            value={answers[currentStep - 1]}
            onValueChange={(value) =>
              setAnswers((prev) => ({ ...prev, [currentStep - 1]: value }))
            }
          >
            <div className="radio-group">
              {options.map((option) => (
                <div key={option.value} className="radio-option">
                  <RadioGroupItem
                    value={option.value}
                    id={`option-${option.value}`}
                  />
                  <Label htmlFor={`option-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      <div className="flex justify-between mt-8">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
          >
            Voltar
          </Button>
        )}
        <Button
          className="ml-auto"
          onClick={handleNext}
        >
          {currentStep === questions.length ? "Ver Resultados" : "Próximo"}
        </Button>
      </div>
    </div>
  );
}
