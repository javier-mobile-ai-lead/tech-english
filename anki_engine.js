
    // ==========================================
    // ANKI SPACED REPETITION ENGINE (SM-2 ALGORITHM)
    // ==========================================
    let ankiDeck = [];
    let currentAnkiReviewQueue = [];
    let currentReviewIndex = 0;
    let isCurrentCardFlipped = false;

    // Spanish prompt mappings for high-value chunks
    const CHUNK_TRANSLATIONS = {
      "To tackle this": "Para resolver / encarar este problema...",
      "I wouldn't": "Yo no [haría X], en su lugar...",
      "To avoid": "Para evitar [problema / fuga / bug]...",
      "To kick things off": "Para arrancar la llamada / reunión...",
      "Greenfield project": "Proyecto desarrollado desde cero (nuevo)...",
      "Legacy codebase": "Código heredado / existente que requiere refactor...",
      "Ship to production": "Publicar / lanzar a producción en las tiendas...",
      "Hit the ground running": "Arrancar a producir resultados de inmediato sin capacitación...",
      "Cross the finish line": "Llevar el proyecto con éxito hasta la meta de entrega...",
      "No hand-holding": "Con total autonomía (sin requerir supervisión constante)...",
      "Single source of truth": "Única fuente de verdad (estado centralizado)...",
      "Decouple": "Desacoplar la lógica de la vista / capa UI...",
      "Offload": "Delegar trabajo pesado a un hilo secundario (background)...",
      "Trade-off": "El balance / concesión técnica (elegir A sacrificando B)...",
      "Bottleneck": "El cuello de botella / traba principal de rendimiento...",
      "Memory leak": "Fuga de memoria no recolectada por el GC...",
      "Dropped frames": "Pérdida de cuadros / animación trabada (jank)...",
      "Reproduce the issue": "Reproducir el bug / fallo de manera consistente...",
      "Root cause": "Aislar la causa raíz del problema técnico..."
    };

    function initAnkiDeck() {
      const storedDeck = localStorage.getItem('tech_english_anki_deck_v1');
      if (storedDeck) {
        try {
          ankiDeck = JSON.parse(storedDeck);
          return;
        } catch(e) {}
      }

      // Generate initial deck from curriculum chunks
      ankiDeck = [];
      (appData.days || []).forEach(day => {
        (day.lexical_chunks || []).forEach((c, idx) => {
          let trigger = 'Para expresar en inglés:';
          for (let key in CHUNK_TRANSLATIONS) {
            if (c.phrase.toLowerCase().includes(key.toLowerCase())) {
              trigger = CHUNK_TRANSLATIONS[key];
              break;
            }
          }
          if (trigger === 'Para expresar en inglés:' && c.meaning) {
            trigger = c.meaning;
          }

          ankiDeck.push({
            id: `card_d${day.day}_c${idx}`,
            day: day.day,
            phrase: c.phrase,
            phonetic: c.phonetic || '',
            meaning: c.meaning || '',
            example: c.example || '',
            front_trigger: trigger,
            // SM-2 parameters
            interval: 0,
            repetition: 0,
            efactor: 2.5,
            dueDate: new Date().toISOString().split('T')[0]
          });
        });
      });
      saveAnkiDeck();
    }

    function saveAnkiDeck() {
      localStorage.setItem('tech_english_anki_deck_v1', JSON.stringify(ankiDeck));
      updateAnkiDueCount();
    }

    function updateAnkiDueCount() {
      const todayStr = new Date().toISOString().split('T')[0];
      const dueCount = ankiDeck.filter(c => !c.dueDate || c.dueDate <= todayStr).length;
      const badge = document.getElementById('ankiDueBadge');
      if (badge) badge.innerText = dueCount;
    }

    function renderAnkiTodayWidget() {
      updateAnkiDueCount();
      const container = document.getElementById('ankiDayCardsGrid');
      if (!container) return;
      container.innerHTML = '';

      const currentDayCards = ankiDeck.filter(c => c.day === selectedDayNum);
      const cardsToShow = currentDayCards.length > 0 ? currentDayCards : ankiDeck.slice(0, 3);

      cardsToShow.forEach(card => {
        const div = document.createElement('div');
        div.className = "p-3.5 bg-white dark:bg-slate-950/80 border border-indigo-100 dark:border-indigo-950/80 rounded-xl space-y-2 hover:border-indigo-400 dark:hover:border-indigo-500 transition shadow-2xs group flex flex-col justify-between";
        div.innerHTML = `
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] font-mono uppercase font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                ${card.interval > 0 ? 'Intervalo: ' + card.interval + 'd' : 'Nueva Tarjeta'}
              </span>
              <button onclick="speakDirect('${card.phrase.replace(/'/g, "\\'")}')" class="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition btn-bounce">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">
              ${card.front_trigger}
            </p>
            <p class="text-xs font-bold text-indigo-900 dark:text-indigo-300 mt-1.5 font-mono">
              👉 ${card.phrase}
            </p>
          </div>
          <div class="text-[11px] text-slate-500 italic border-t border-slate-100 dark:border-slate-900 pt-1.5 mt-1">
            "${card.example}"
          </div>
        `;
        container.appendChild(div);
      });
      lucide.createIcons();
    }

    function toggleAnkiPracticeModal() {
      const modal = document.getElementById('ankiModal');
      if (modal.classList.contains('hidden')) {
        const todayStr = new Date().toISOString().split('T')[0];
        currentAnkiReviewQueue = ankiDeck.filter(c => c.day === selectedDayNum);
        if (currentAnkiReviewQueue.length === 0) {
          currentAnkiReviewQueue = ankiDeck.filter(c => !c.dueDate || c.dueDate <= todayStr);
        }
        if (currentAnkiReviewQueue.length === 0) {
          currentAnkiReviewQueue = ankiDeck.slice(0, 4);
        }

        currentReviewIndex = 0;
        showAnkiCard(currentReviewIndex);
        modal.classList.remove('hidden');
      } else {
        modal.classList.add('hidden');
        renderAnkiTodayWidget();
      }
    }

    function showAnkiCard(idx) {
      if (idx >= currentAnkiReviewQueue.length) {
        SoundFX.playChime();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        showToast('🎉 ¡Excelente sesión de Anki completada!');
        toggleAnkiPracticeModal();
        return;
      }

      const card = currentAnkiReviewQueue[idx];
      isCurrentCardFlipped = false;

      const cardEl = document.getElementById('ankiCardElement');
      cardEl.classList.remove('rotate-y-180');

      document.getElementById('ankiGradingControls').classList.add('hidden');
      document.getElementById('ankiProgressCounter').innerText = 'Card ' + (idx + 1) + ' of ' + currentAnkiReviewQueue.length;
      document.getElementById('ankiCardTriggerContext').innerText = 'Day ' + card.day + ' • Gatillo mental:';
      document.getElementById('ankiCardFrontText').innerText = card.front_trigger;
      document.getElementById('ankiCardBackPhrase').innerText = card.phrase;
      document.getElementById('ankiCardPhonetic').innerText = card.phonetic || '';
      document.getElementById('ankiCardExampleBox').innerText = '"' + card.example + '"';
      lucide.createIcons();
    }

    function flipAnkiCard() {
      if (isCurrentCardFlipped) return;
      isCurrentCardFlipped = true;
      SoundFX.playPop();
      document.getElementById('ankiCardElement').classList.add('rotate-y-180');
      document.getElementById('ankiGradingControls').classList.remove('hidden');
      speakAnkiCurrentCard();
    }

    function speakAnkiCurrentCard() {
      const card = currentAnkiReviewQueue[currentReviewIndex];
      if (card) {
        speakDirect(card.phrase);
      }
    }

    // SuperMemo-2 (SM-2) Grading Algorithm Implementation
    function gradeAnkiCard(grade) {
      const card = currentAnkiReviewQueue[currentReviewIndex];
      if (!card) return;

      SoundFX.playPop();

      let interval = card.interval || 0;
      let repetition = card.repetition || 0;
      let efactor = card.efactor || 2.5;

      const q = grade === 1 ? 0 : grade === 2 ? 3 : grade === 3 ? 4 : 5;

      if (q >= 3) {
        if (repetition === 0) {
          interval = 1;
        } else if (repetition === 1) {
          interval = grade === 2 ? 2 : grade === 3 ? 3 : 6;
        } else {
          interval = Math.round(interval * efactor);
        }
        repetition += 1;
      } else {
        repetition = 0;
        interval = 0;
      }

      efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      if (efactor < 1.3) efactor = 1.3;

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);
      card.interval = interval;
      card.repetition = repetition;
      card.efactor = parseFloat(efactor.toFixed(2));
      card.dueDate = nextDate.toISOString().split('T')[0];

      const deckIdx = ankiDeck.findIndex(c => c.id === card.id);
      if (deckIdx >= 0) ankiDeck[deckIdx] = card;
      saveAnkiDeck();

      currentReviewIndex++;
      showAnkiCard(currentReviewIndex);
    }

    // Export entire deck to standard Anki desktop format (.txt)
    function exportAnkiDeck() {
      let tsv = "#separator:tab\n#html:true\n#tags column:4\n";
      ankiDeck.forEach(c => {
        const front = '<b>' + c.front_trigger + '</b><br><small style="color:gray">🗣️ Dilo en voz alta antes de voltear</small>';
        const back = '<h2>' + c.phrase + '</h2><p><i>' + c.phonetic + '</i></p><p>' + c.meaning + '</p><hr><blockquote>"' + c.example + '"</blockquote>';
        tsv += front + '\t' + back + '\tDay_' + c.day + '\tTech_English\n';
      });

      const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Tech_English_Anki_Deck_Javier.txt';
      a.click();
      URL.revokeObjectURL(url);
      showToast('📥 Mazo de Anki descargado listo para importar');
    }
