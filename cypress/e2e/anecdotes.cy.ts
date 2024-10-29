describe('Anecdotes App', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    // Helper function to delete all test anecdotes
    const cleanupAllTestAnecdotes = () => {
        // Navigate to anecdotes tab
        cy.get('#anecdotes').click();
        cy.wait(500); // Wait for navigation

        // Filter for e2e-testing topic
        cy.get('input[placeholder*="Use topic:"]')
            .should('be.visible')
            .clear()
            .type('topic:e2e-testing');

        cy.wait(500); // Wait for filter to apply

        // Check if there are any rows and delete them
        cy.get('tbody').then($tbody => {
            if ($tbody.find('tr').length > 0) {
                cy.get('tbody tr').each(() => {
                    cy.get('tbody tr')
                        .first()
                        .find('button')
                        .contains('Delete')
                        .click();
                    cy.wait(500);
                });
            }
        });
    };

    // Add cleanup after each test
    afterEach(() => {
        cleanupAllTestAnecdotes();
    });

    describe('Navigation and Layout', () => {
        it('shows correct tabs and navigation', () => {
            // Check if all tabs are present
            cy.get('#create').should('be.visible');
            cy.get('#anecdotes').should('be.visible');
            cy.get('#faq').should('be.visible');

            // Check tab navigation
            cy.get('#anecdotes').click();
            cy.get('table').should('be.visible');

            cy.get('#faq').click();
            cy.get('#faq').should('be.visible');

            cy.get('#create').click();
            cy.contains("What's your topic?").should('be.visible');
        });
    });

    describe('Manual Anecdote Creation', () => {
        beforeEach(() => {
            cy.contains('Write Manually').click();
        });

        it('creates an anecdote manually with all steps', () => {
            const testContent = `Manual test anecdote ${Date.now()}`;
            // Step 1: Topic
            cy.get('input[placeholder*="Programming"]').type('e2e-testing');
            cy.get('#next-button').click();

            // Step 2: Content
            cy.get('textarea[placeholder*="Share your story"]').type(testContent);
            cy.get('#next-button').click();

            // Step 3: Review and Post
            cy.get('#post-button').click();

            // Verify we're redirected to anecdotes list
            cy.contains(testContent).should('be.visible');
        });

        it('shows finish writing functionality', () => {
            // Navigate to content step
            cy.get('input[placeholder*="Programming"]').type('e2e-testing');
            cy.get('#next-button').click();

            // Type partial content
            cy.get('textarea[placeholder*="Share your story"]').type('This is an unfinished test content');
            cy.contains('Finish Writing').click();
            cy.get('textarea').should('not.have.value', 'This is an unfinished test content');
        });

        it('validates required fields', () => {
            // Try to proceed without topic
            cy.get('#next-button').should('be.disabled');

            // Add topic and proceed
            cy.get('input[placeholder*="Programming"]').type('e2e-testing');
            cy.get('#next-button').click();

            // Try to proceed without content
            cy.get('#next-button').should('be.disabled');
        });
    });

    describe('AI Anecdote Generation', () => {
        beforeEach(() => {
            cy.contains('Generate with AI').click();
        });

        it('generates an anecdote using AI', () => {
            // Step 1: Topic
            cy.get('input[placeholder*="Travel"]').type('e2e-testing');
            cy.get('#next-button').click();

            // Step 2: Generate
            cy.contains('Generate Anecdote').click();
            cy.get('#ai-skeleton-1').should('exist');
            cy.get('#ai-skeleton-2').should('exist');
            cy.get('#ai-skeleton-3').should('exist');
            cy.get('textarea').should('exist');

            // Get the generated content and post it
            cy.get('textarea').invoke('val').then((generatedContent) => {
                cy.get('#post-button').click();

                // Cleanup
                if (generatedContent) {
                    cleanupAllTestAnecdotes();
                }
            });
        });

        it('allows regeneration of AI content', () => {
            // Generate first anecdote
            cy.get('input[placeholder*="Travel"]').type('e2e-testing');
            cy.get('#next-button').click();
            cy.contains('Generate Anecdote').click();
            cy.get('textarea').should('exist');

            // Store first generated content and verify regeneration
            cy.get('textarea').invoke('val').then((firstContent) => {
                cy.contains('Regenerate').click();
                cy.contains('Generate Anecdote').click();
                cy.get('textarea').should('not.have.value', firstContent);

                // Get final content and post it
                cy.get('textarea').invoke('val').then((finalContent) => {
                    cy.get('#post-button').click();

                    // Cleanup
                    if (finalContent) {
                        cleanupAllTestAnecdotes();
                    }
                });
            });
        });
    });

    describe('Filter Functionality', () => {
        beforeEach(() => {
            // Create a test anecdote first
            cy.get('#create').click();
            cy.contains('Write Manually').click();
            cy.get('input[placeholder*="Programming"]').type('e2e-testing');
            cy.get('#next-button').click();
            cy.get('textarea[placeholder*="Share your story"]').type(`Filter test content ${Date.now()}`);
            cy.get('#next-button').click();
            cy.get('#post-button').click();

            // Go to anecdotes tab
            cy.get('#anecdotes').click();
        });

        it('filters by topic', () => {
            cy.get('input[placeholder*="Use topic:"]').type('topic:e2e-testing');
            cy.get('tbody tr').should('have.length.at.least', 1);
        });

        it('filters by content', () => {
            // Create a test anecdote to filter
            const testTopic = 'TestTopic';
            const testContent = `UniqueContent${Date.now()}`;

            // Go to create tab
            cy.get('#create').click();
            cy.contains('Write Manually').click();
            cy.get('input[placeholder*="Programming"]').type(testTopic);
            cy.get('#next-button').click();
            cy.get('textarea[placeholder*="Share your story"]').type(testContent);
            cy.get('#next-button').click();
            cy.get('#post-button').click();

            // Go back to anecdotes tab
            cy.get('#anecdotes').click();

            // Apply filter
            cy.get('input[placeholder*="Use topic:"]').type(`content:${testContent}`);
            cy.get('tbody tr').should('have.length', 1);
            cy.contains(testContent).should('be.visible');

            // Cleanup
            cleanupAllTestAnecdotes();
        });

        it('shows no results message when no matches', () => {
            cy.get('input[placeholder*="Use topic:"]').type('topic:nonexistent12345');
            cy.contains('No matching anecdotes found.').should('be.visible');
        });
    });

    describe('Anecdote Management', () => {
        beforeEach(() => {
            // Create a test anecdote first
            cy.get('#create').click();
            cy.contains('Write Manually').click();
            cy.get('input[placeholder*="Programming"]').type('e2e-testing');
            cy.get('#next-button').click();
            cy.get('textarea[placeholder*="Share your story"]').type(`Management test content ${Date.now()}`);
            cy.get('#next-button').click();
            cy.get('#post-button').click();

            // Go to anecdotes tab
            cy.get('#anecdotes').click();
        });

        it('votes for an anecdote', () => {
            cy.get('tbody tr').first().within(() => {
                cy.get('#vote-amount').invoke('text').then((initialVotes) => {
                    cy.contains('Vote').click();
                    // Wait for vote to be processed
                    cy.wait(500);
                    cy.get('#vote-amount').should('not.have.text', initialVotes);
                });
            });
        });

        it('deletes an anecdote', () => {
            cy.get('tbody tr').then(($rows) => {
                const initialCount = $rows.length;
                const firstRowContent = $rows.first().find('td').eq(1).text();

                cy.get('tbody tr').first().within(() => {
                    cy.contains('Delete').click();
                });

                // Wait for deletion and verify
                cy.wait(500);
                cy.get('tbody tr').should('have.length', initialCount - 1);
                cy.contains(firstRowContent).should('not.exist');
            });
        });


    });
});