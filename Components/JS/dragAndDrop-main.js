const quizzes = document.querySelectorAll('.quiz');
if(quizzes.length > 0) {
    quizzes.forEach((quiz) => {
        let columnSetsRef = [];

        const blockSortingNode = quiz.querySelector('.block-sorting');
        if (blockSortingNode) { 
            blockSortingNode.setAttribute('data-id', blockSortingNode.id); 

            const aSetOfBlocks = blockSortingNode.querySelector('.a-set-of-blocks');
            const blocks = aSetOfBlocks.querySelectorAll('.block');
            
            blocks.forEach(block => {
                block.setAttribute('draggable', 'true'); 
                block.addEventListener('dragstart', (e) => {
                    e.target.classList.add('dragging');
                    const draggingId = blockSortingNode.getAttribute('data-id');
                    e.dataTransfer.setData('text/plain', draggingId); 
                    quizzes.forEach(quiz => {
                        const quizBlockSorting = quiz.querySelector('.block-sorting');
                        if (quizBlockSorting) {
                            const quizId = quizBlockSorting.getAttribute('data-id');
                            if (quizId !== draggingId) {
                                // Usuń istniejący overlay, jeśli istnieje
                                const existingOverlay = quiz.querySelector('.overlay');
                                if (existingOverlay) {
                                    existingOverlay.remove();
                                }
                                // Stwórz nowy overlay
                                const overlay = document.createElement('div');
                                overlay.classList.add('overlay');
                                quiz.appendChild(overlay);
                            }
                        }
                    });
                });
                block.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                    // Usuń overlay po zakończeniu przeciągania
                    document.querySelectorAll('.overlay').forEach(overlay => overlay.remove());
                }); 
            });

            columnSetsRef.push(aSetOfBlocks);

            blockSortingNode.querySelector(".collections").querySelectorAll('.set-container').forEach((setContainer) => {
                columnSetsRef.push(setContainer);
            });

            dragglesObjects(columnSetsRef);
        }
    });
}

function dragglesObjects(columnSetsRef) {
    columnSetsRef.forEach(columnSet => {
        columnSet.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingId = e.dataTransfer.getData('text/plain');
            if (draggingId === columnSet.closest('.block-sorting').getAttribute('data-id')) {
                // columnSet.closest('.quiz').querySelector('.overlay').style.display = 'none';
            }
        });
        columnSet.addEventListener('drop', (e) => {
            const draggingId = e.dataTransfer.getData('text/plain');
            if (draggingId !== columnSet.closest('.block-sorting').getAttribute('data-id')) return;
            const applyAfter = getDragNewPositionElement(columnSet, e.clientY);
            const dragging = document.querySelector('.dragging');
            if(applyAfter === null) {
                columnSet.appendChild(dragging);
            } else {
                columnSet.insertBefore(dragging, applyAfter);
            }
        });
    });
}

function getDragNewPositionElement(columnSet, posY){
    const draggableElements = [...columnSet.querySelectorAll('.block:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = posY - box.top - box.height / 2;
        if(offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child};
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element;
}