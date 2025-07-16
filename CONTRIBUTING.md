# Contributing to Lightning Rock Paper Scissors

Thank you for your interest in contributing to Lightning Rock Paper Scissors! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professionalism in all interactions

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL 14 or higher
- Git knowledge
- Basic understanding of React, TypeScript, and Lightning Network

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/your-username/lightning-rps.git
cd lightning-rps
```

3. Add the original repository as upstream:
```bash
git remote add upstream https://github.com/original-repo/lightning-rps.git
```

4. Follow the setup instructions in [DEVELOPMENT.md](docs/DEVELOPMENT.md)

## Contributing Process

### 1. Choose an Issue

- Browse open issues on GitHub
- Look for issues labeled "good first issue" for beginners
- Comment on the issue to indicate you're working on it
- Ask questions if anything is unclear

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `style/styling-improvements` - UI/UX improvements

### 3. Make Changes

- Follow the coding standards in [DEVELOPMENT.md](docs/DEVELOPMENT.md)
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass

### 4. Test Your Changes

```bash
# Run all tests
npm test

# Run type checking
npm run type-check

# Build the project
npm run build

# Test the application manually
npm run dev
```

### 5. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add multiplayer matchmaking system"
git commit -m "fix: resolve payment synchronization issue"
git commit -m "docs: update API documentation"
git commit -m "style: improve brutalist button design"
```

### 6. Submit a Pull Request

1. Push your branch to your fork:
```bash
git push origin feature/your-feature-name
```

2. Create a pull request on GitHub
3. Fill out the pull request template
4. Wait for review and address feedback

## Types of Contributions

### Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or videos if applicable
- Browser/OS information
- Console errors or logs

### Feature Requests

For new features, please provide:

- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Any breaking changes

### Code Contributions

Areas where contributions are welcome:

- **Game Features**: New game modes, tournament brackets
- **UI/UX**: Design improvements, animations, accessibility
- **Lightning Integration**: Payment optimizations, wallet support
- **Performance**: Database optimization, caching, bundle size
- **Testing**: Unit tests, integration tests, E2E tests
- **Documentation**: API docs, tutorials, examples

### Documentation

Help improve documentation:

- Fix typos and grammar
- Add examples and tutorials
- Improve API documentation
- Create video tutorials
- Translate documentation

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use meaningful variable names
- Add JSDoc comments for complex functions

### React

- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Use TypeScript interfaces for props

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow neo-brutalist design principles
- Create reusable component styles
- Maintain consistent spacing

### API Design

- Use RESTful endpoints
- Implement proper error handling
- Validate all inputs
- Return consistent response formats

## Testing Guidelines

### Unit Tests

- Test individual components and functions
- Mock external dependencies
- Use descriptive test names
- Aim for high test coverage

### Integration Tests

- Test API endpoints
- Test database operations
- Test Lightning Network integration
- Test error scenarios

### E2E Tests

- Test critical user flows
- Test cross-browser compatibility
- Test responsive design
- Test payment workflows

## Lightning Network Guidelines

### Development

- Use regtest for development
- Test with small amounts
- Mock payment flows when appropriate
- Handle network failures gracefully

### Security

- Validate all payment amounts
- Implement proper error handling
- Use secure connection strings
- Test payment edge cases

## Design Guidelines

### Neo-Brutalist Principles

- Heavy borders and shadows
- High contrast colors
- Pixelated aesthetics
- Bold typography
- Geometric shapes

### Accessibility

- Ensure keyboard navigation
- Provide alt text for images
- Use semantic HTML
- Test with screen readers
- Maintain color contrast ratios

## Review Process

### Code Review

All submissions go through code review:

1. **Automated Checks**: TypeScript, tests, linting
2. **Peer Review**: Code quality, design, functionality
3. **Testing**: Manual testing of changes
4. **Documentation**: Ensure docs are updated

### Review Criteria

- Code quality and maintainability
- Test coverage and quality
- Documentation completeness
- Performance impact
- Security considerations
- User experience

## Release Process

### Versioning

We use semantic versioning (SemVer):

- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Release Notes

Each release includes:

- New features
- Bug fixes
- Breaking changes
- Migration guide
- Known issues

## Community

### Communication

- GitHub Issues for bugs and features
- GitHub Discussions for questions
- Discord for real-time chat
- Twitter for updates

### Getting Help

- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Join our Discord community

## Recognition

Contributors are recognized through:

- GitHub contributors page
- Release notes mentions
- Hall of Fame in documentation
- Special Discord roles

## Legal

### License

By contributing, you agree that your contributions will be licensed under the MIT License.

### Copyright

- You retain copyright of your contributions
- You grant the project a perpetual license to use your work
- Ensure you have rights to contribute any code

### Third-Party Code

- Only include code you have rights to use
- Properly attribute third-party code
- Check license compatibility
- Update dependency licenses

## Questions?

If you have questions about contributing:

1. Check the [DEVELOPMENT.md](docs/DEVELOPMENT.md) guide
2. Browse existing issues and discussions
3. Ask in GitHub Discussions
4. Join our Discord community
5. Email the maintainers

Thank you for contributing to Lightning Rock Paper Scissors! ⚡

---

*This document is a living guide and may be updated as the project evolves.*