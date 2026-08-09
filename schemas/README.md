# Schemas

Machine-readable JSON Schemas (draft 2020-12) for the data shapes ÆON runtimes exchange and persist. The prose specifications remain the normative source; these schemas exist so fixtures, evals and tooling can check structure mechanically.

| Schema | Validates | Normative prose |
|---|---|---|
| [capability.schema.json](capability.schema.json) | Capability profile | [protocol/capabilities.md](../protocol/capabilities.md) |
| [learner.schema.json](learner.schema.json) | Learner state | [protocol/state.md](../protocol/state.md) |
| [curriculum.schema.json](curriculum.schema.json) | Compiled curriculum | [products/learn/curriculum.md](../products/learn/curriculum.md) |
| [lesson.schema.json](lesson.schema.json) | Canonical semantic lesson | [products/learn/session.md](../products/learn/session.md) |
| [topic-package.schema.json](topic-package.schema.json) | Library package manifest | [library/](../library/) |

## Identifiers

Every schema declares `$id: https://learn.rapold.io/schemas/<name>.schema.json`. These URIs are identifiers, not fetch locations: agents retrieve schemas and specifications from GitHub raw URLs pinned to an immutable tag, for example `https://raw.githubusercontent.com/marcelrapold/aeon-protocol/v0.1.0/schemas/curriculum.schema.json`.

## Validation strictness

The curriculum schema requires only a structural minimum per module (`id`, `title`, `learning_objective`, `core_concepts`, `exercise`, `reflection`, `estimated_duration`). The full 12-field module contract is normative in prose (LEARN-6 in [products/learn/specification.md](../products/learn/specification.md)); the schema stays looser so that fixtures, partially compiled curricula and in-flight state still validate. For the same reason curriculum modules and topic-package manifests accept additional properties (fixtures carry renderer- and subject-specific extras), and field types stay permissive where fixtures vary: versions accept an integer or a version string, module evidence accepts a summary string or a list, durations accept minutes or a phrase. Reflection counts follow the same stance in both the curriculum and lesson schemas: "normally three questions" (LEARN-S-8) is prose-normative, so the schemas require only a non-empty list.

## Validating locally

```sh
npx ajv-cli validate --spec=draft2020 -s schemas/curriculum.schema.json -d products/learn/examples/charisma/curriculum.yaml
```

`ajv-cli` reads YAML and JSON data files; swap `-s` and `-d` for any schema-fixture pair. Alternatively, the site test suite under [site/learn/](../site/learn/) validates the repository fixtures against these schemas.
